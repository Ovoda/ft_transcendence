import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GameRoom } from '../types/gameRoom.interface';

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private games: GameRoom[] = [];

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway')

	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, message: string) {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.logger.log(`Current Games: ${this.games.length}`);
		let status: boolean;
		if (!this.games.length || this.games[this.games.length - 1].status === true) {
			const newGame: GameRoom = {
				id: "game" + client.id,
				status: false,
				player1: client.id,
				player2: null,
			}
			this.games.push(newGame);
			console.log("join room");
			client.join(newGame.id);
			status = false;
			this.server.to(this.games[this.games.length - 1].id).emit('gameStatus', status);
		}
		else {
			this.games[this.games.length - 1].player2 = client.id;
			this.games[this.games.length - 1].status = true;
			console.log("join room");

			client.join(this.games[this.games.length - 1].id);
			status = true;
			this.server.to(this.games[this.games.length - 1].id).emit('gameStatus', status);
		}
	}


	@SubscribeMessage('udpateRightScore')
	handleResetScore(client: Socket, data: any) {
		console.log("Update Score Right");
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit("updateScore", data);
		}
	}

	@SubscribeMessage('udpateLeftScore')
	handleNewLeftScore(client: Socket, data: number) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit("updateScore", data);
		}
	}

	@SubscribeMessage('animateGame')
	handleAnimateGame(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})
		if (index >= 0 && this.games[index].player1 === client.id) {
			this.server.to(this.games[index].id).emit("updateBall", data);
		}
	}

	@SubscribeMessage('leaveGame')
	handleLeaveGame(client: Socket) {
		const index = this.games.findIndex((game: GameRoom) => {
			return game.player1 === client.id || game.player2 === client.id;
		})
		if (index >= 0) {
			this.server.to(this.games[index].id).emit('gameStop', client.id);
		}
	}

	@SubscribeMessage('deleteRoom')
	handleDeleteRoom(client: Socket) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})
		if (index >= 0) {
			client.leave(this.games[index].id);
			if (this.games[index].player1 === client.id) {
				this.games[index].player1 = null;
			}
			else if (this.games[index].player2 === client.id) {
				this.games[index].player2 = null;
			}
			if (this.games[index].player1 === null && this.games[index].player2 === null) {
				this.games = [...this.games.slice(0, index), ...this.games.slice(index + 1)];
			}
		}
	}

	@SubscribeMessage('movePlayer')
	handleArrow(client: Socket, data: number): void {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})

		if (index >= 0) {
			if (this.games[index].player1 === client.id) {
				this.server.to(this.games[index].id).emit('updateLeftPlayer', data);
			}
			else if (this.games[index].player2 === client.id) {
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
			return game.player1 === client.id || game.player2 === client.id;
		})
		if (index >= 0) {
			if (this.games[index].player1 === client.id)
				this.server.to(this.games[index].player2).emit('gameStop', this.games[index].player1);
			else if (this.games[index].player2 === client.id)
				this.server.to(this.games[index].player1).emit('gameStop', this.games[index].player2);
			this.logger.log(`Client disconnected: ${client.id}`);
			this.handleDeleteRoom(client);
		}
	}
}
