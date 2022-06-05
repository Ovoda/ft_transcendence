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

	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, user: string) {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.logger.log(`Current Games: ${this.games.length}`);
		let status: boolean;
		if (!this.games.length || this.games[this.games.length - 1].status === true) {
			const newGame: GameRoom = {
				id: "game" + client.id,
				status: false,
				socket1: client.id,
				socket2: null,
				user1: user,
				user2: null,
			}
			this.games.push(newGame);
			console.log("JOIN ROOM");
			console.log(client.id, "in room ", newGame);
			client.join(newGame.id);
			status = false;
			this.server.to(client.id).emit('setSide', "left");
			this.server.to(this.games[this.games.length - 1].id).emit('gameStatus', status);
		}
		else {
			this.games[this.games.length - 1].socket2 = client.id;
			this.games[this.games.length - 1].status = true;
			client.join(this.games[this.games.length - 1].id);
			status = true;
			this.server.to(client.id).emit('setSide', "right");
			this.games[this.games.length - 1].user2 = user;
			console.log("JOIN ROOM");
			console.log(client.id, "in room ", this.games[this.games.length - 1]);
			this.server.to(this.games[this.games.length - 1].id).emit('gameStatus', status);
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
				score1: data[0],
				score2: data[1],
				winner: (client.id === this.games[index].socket1 ? this.games[index].user2 : this.games[index].user1),
			}
			return await this.gameService.saveNewGame(newdto);
		}
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

	//@SubscribeMessage('msgToServer')
	//handleMessage(client: Socket, data: any): void {
	// this.logger.log(`Client sent: ${data}`);
	//	this.server.emit('msgToClient', data)
	//}

	afterInit(server: any) {
		// this.logger.log('Init');
	}

	handleConnection(client: Socket, ...args: any[]) {
		// this.logger.log(`Client connected: ${client.id}`);
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
