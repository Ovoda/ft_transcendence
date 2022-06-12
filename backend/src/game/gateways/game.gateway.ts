import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GameRoom } from '../types/gameRoom.interface';
import { CannotPlay } from "../exceptions/cannotPlay.exception";
import { GameService } from "../services/game.service";
import { UserService } from "src/user/user.service";
import { UserActivityStatusEnum } from "src/user/enums/userConnectionStatus.enum";
import * as _ from 'lodash';
import { UpdateStatsDto } from "../dtos/updateStats.dto";
import { emit } from "process";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
		private readonly userService: UserService,
	) { }

	private games: GameRoom[] = [];

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway')


	/** Match Making Between Players **/



	@SubscribeMessage('gameRequestToFriend')
	handleGameRequest(client: Socket, user: any) {
		this.server.to(user.socket).emit("gameRequestFromFriend", user);
	}

	@SubscribeMessage('createGame')
	handleCreateGame(client: Socket, user1: any, user2: any) {
		const newGame: GameRoom = {
			id: "game" + user1.socket,
			status: true,
			socket1: user1.socket,
			socket2: user2.socket,
			login1: user1.login,
			login2: user2.login,
			user1: user1.id,
			user2: user2.id,
			watchers: [],
		}
		this.games.push(newGame);
		user1.socket.join(newGame.id);
		user2.socket.join(newGame.id);
		this.server.to(user1.socket).emit('setSide', "left");
		this.server.to(user2.socket).emit('setSide', "right");
		this.server.to(newGame.id).emit('gameStatus', true);
	}

	@SubscribeMessage('joinGame')
	async handleJoinGame(client: Socket, data: any) {
		this.logger.log(`New Game Request from: ${client.id}`);
		if (!this.games.length || this.games[this.games.length - 1].status === true) {
			const newGame: GameRoom = {
				id: "game" + client.id,
				status: false,
				socket1: client.id,
				socket2: null,
				login1: data.login,
				login2: null,
				user1: data.id,
				user2: null,
				watchers: [],
			}
			this.games.push(newGame);
			this.logger.log(`Current Games: ${this.games.length}`);

			await this.userService.setUserAsQueuing(data.id);

			client.join(newGame.id);
			this.server.to(client.id).emit('setSide', "left");
			this.server.to(newGame.id).emit('gameStatus', false);
		}
		else {
			const gameroom: GameRoom = this.games[this.games.length - 1];
			gameroom.socket2 = client.id;
			gameroom.user2 = data.id;
			gameroom.login2 = data.login;
			gameroom.status = true;

			await this.userService.setUserAsPlaying(gameroom.user1);
			await this.userService.setUserAsPlaying(gameroom.user2);
			this.server.emit("FriendConnection", gameroom.user1);
			this.server.emit("FriendConnection", gameroom.user2);

			client.join(gameroom.id);
			this.server.to(client.id).emit('setSide', "right");
			this.server.to(gameroom.socket1).emit('rightLogin', gameroom.login2);
			this.server.to(gameroom.socket2).emit('leftLogin', gameroom.login1);
			this.server.to(gameroom.id).emit('gameStatus', true);
		}
	}

	/** Watchers added to game room without role to move **/
	@SubscribeMessage('WatchingRequest')
	handleWatchingRequest(client: Socket, data: string) {
		this.server.to(client.id).emit("startWatching", data);
	}

	@SubscribeMessage('joinGameAsWatcher')
	handleNewWatcher(client: Socket, data: any) {

		const watched = data.watched;
		const watcher = data.watcher;

		const game = this.games.find((game: GameRoom) => {
			return (game.user1 === watched || game.user2 === watched);
		})
		if (!game) { return; }
		game.watchers.push(client.id);
		this.userService.setUserAsWatching(watcher);
		client.join(game.id);
		let logins = {
			left: game.login1,
			right: game.login2,
		}
		console.log("Watching...");
		console.log(logins);
		this.server.to(client.id).emit("setLogin", logins);
	}

	@SubscribeMessage('pauseGameRequest')
	handlePauseRequest(client: Socket) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit('pauseGame');
		}
	}

	@SubscribeMessage('resumeGameRequest')
	handleResumeRequest(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit("resumeGame", data);
		}
	}


	@SubscribeMessage('resetGame')
	handleResetScore(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit('updateScore', data);
		}
	}

	@SubscribeMessage('animateGame')
	handleAnimateGame(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0 && this.games[index].socket1 === client.id) {
			this.server.to(this.games[index].id).emit('updateBall', data);
		}
	}

	@SubscribeMessage('leaveGame')
	async handleLeaveGame(client: Socket, data: any) {

		const game = this.games.find((game: GameRoom) => {
			return game.socket1 === client.id || game.socket2 === client.id;
		});

		if (!game) { return; }

		this.server.to(game.id).emit('gameStop', client.id);
		let updateStatsDto: UpdateStatsDto = {
			winnerId: (data.posX > data.posY) ? game.user1 : game.user2,
			loserId: (data.posX < data.posY) ? game.user1 : game.user2,
		}
		if (data.winnerId && data.loserId) {
			console.log(updateStatsDto);
			return await this.gameService.saveNewStats(updateStatsDto);
		}
	}

	@SubscribeMessage('stopWatching')
	handleStopWatching(client: Socket) {
		let watcherIndex: number;

		const gameIndex = this.games.findIndex((game: GameRoom) => {
			return watcherIndex = game.watchers.findIndex((watcher: string) => {
				return watcher === client.id;
			})
		});
		client.leave(this.games[gameIndex].id);
		this.games[gameIndex].watchers = [...this.games[gameIndex].watchers.slice(0, watcherIndex), ...this.games[gameIndex].watchers.slice(watcherIndex + 1)];
	}

	@SubscribeMessage('deleteRoom')
	async handleDeleteRoom(client: Socket) {
		const game = this.games.find((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		});

		if (!game) { return; }

		client.leave(game.id);
		if (game.socket1 === client.id) {
			game.socket1 = null;
		} else if (game.socket2 === client.id) {
			game.socket2 = null;
		}

		if (game.socket1 === null && game.socket2 === null) {
			if (game.user1) {
				await this.userService.setUserAsConnected(game.user1);
				this.server.emit("FriendConnection", game.user1);
			}
			if (game.user2) {
				await this.userService.setUserAsConnected(game.user2);
				this.server.emit("FriendConnection", game.user2);
			}
			_.remove(this.games, game);
			this.logger.log(`Current Games: ${this.games.length}`);
		}
	}

	@SubscribeMessage('movePlayer')
	handleArrow(client: Socket, data: number): void {
		const game = this.games.find((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})

		if (!game) { return; }

		if (game.socket1 === client.id) {
			this.server.to(game.id).emit('updateLeftPlayer', data);
		} else if (game.socket2 === client.id) {
			this.server.to(game.id).emit('updateRightPlayer', data);
		}
	}

	afterInit(server: any) {
		this.logger.log('Init');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket, ...args: any[]) {
		const game = this.games.find((game: GameRoom) => {
			return game.socket1 === client.id || game.socket2 === client.id;
		})

		if (!game) { return; }

		if (game.socket1 === client.id) {
			this.server.to(game.socket2).emit('gameStop', game.socket1);
		} else if (game.socket2 === client.id) {
			this.server.to(game.socket1).emit('gameStop', game.socket2);
		}
		this.logger.log(`Client disconnected: ${client.id}`);
		this.handleDeleteRoom(client);
	}
}
