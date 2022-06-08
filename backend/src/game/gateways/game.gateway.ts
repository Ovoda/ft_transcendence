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
import { CreateGameDto } from "../dto/createGame.dto";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
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
	handleJoinGame(client: Socket, data: any) {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.logger.log(`Current Games: ${this.games.length}`);
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
			client.join(gameroom.id);
			this.server.to(client.id).emit('setSide', "right");
			this.server.to(gameroom.socket1).emit('rightLogin', gameroom.login2);
			this.server.to(gameroom.socket2).emit('leftLogin', gameroom.login1);
			this.server.to(gameroom.id).emit('gameStatus', true);
		}
	}

	/** Watchers added to game room without role to move **/
	@SubscribeMessage('watchingRequest')
	handleWatchingRequest(client: Socket, data: string) {
		this.server.to(client.id).emit("startWatching", data);
	}

	@SubscribeMessage('joinGameAsWatcher')
	handleNewWatcher(client: Socket, data: string) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.login1 === data || game.login2 === data);
		})
		if (index >= 0) {
			this.games[index].watchers.push(client.id);
			client.join(this.games[index].id);
		}
	}


	@SubscribeMessage('pauseGameRequest')
	handlePauseRequest(client: Socket) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit("pauseGame");
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
			this.server.to(this.games[index].id).emit("updateScore", data);
		}
	}

	@SubscribeMessage('animateGame')
	handleAnimateGame(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0 && this.games[index].socket1 === client.id) {
			this.server.to(this.games[index].id).emit("updateBall", data);
		}
	}

	@SubscribeMessage('leaveGame')
	async handleLeaveGame(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return game.socket1 === client.id || game.socket2 === client.id;
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit('gameStop', client.id);
			const newdto: CreateGameDto = {
				user1: this.games[index].user1,
				user2: this.games[index].user2,
				score1: data.posX,
				score2: data.posY,
				winner: (client.id === this.games[index].socket1 ? this.games[index].user2 : this.games[index].user1),
			}
			//return await this.gameService.saveNewGame(newdto);
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
	handleDeleteRoom(client: Socket) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})
		if (index >= 0) {
			client.leave(this.games[index].id);
			if (this.games[index].socket1 === client.id) {
				this.games[index].socket1 = null;
			}
			else if (this.games[index].socket2 === client.id) {
				this.games[index].socket2 = null;
			}
			if (this.games[index].socket1 === null && this.games[index].socket2 === null) {
				this.games = [...this.games.slice(0, index), ...this.games.slice(index + 1)];
			}
		}
	}

	@SubscribeMessage('movePlayer')
	handleArrow(client: Socket, data: number): void {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})

		if (index >= 0) {
			if (this.games[index].socket1 === client.id) {
				this.server.to(this.games[index].id).emit('updateLeftPlayer', data);
			}
			else if (this.games[index].socket2 === client.id) {
				this.server.to(this.games[index].id).emit('updateRightPlayer', data);
			}
		}
	}

	afterInit(server: any) {
		this.logger.log('Init');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket, ...args: any[]) {
		const index = this.games.findIndex((game: GameRoom) => {
			return game.socket1 === client.id || game.socket2 === client.id;
		})
		if (index >= 0) {
			if (this.games[index].socket1 === client.id)
				this.server.to(this.games[index].socket2).emit('gameStop', this.games[index].socket1);
			else if (this.games[index].socket2 === client.id)
				this.server.to(this.games[index].socket1).emit('gameStop', this.games[index].socket2);
			this.logger.log(`Client disconnected: ${client.id}`);
			this.handleDeleteRoom(client);
		}
	}
}
