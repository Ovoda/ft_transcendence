import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { ConsoleLogger, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GameRoom} from '../types/gameRoom.interface';
import { GameFront} from '../types/gameFront.interface';
import { rootCertificates } from "tls";
import { throws } from "assert";
import { emit } from "process";


@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
	},
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private games: GameRoom[] = [];

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway')


	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, message: string) {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.logger.log(`Current: ${this.games.length}`);
		let status: boolean;
		if (!this.games.length || this.games[this.games.length - 1].status === true) {
			const newGame: GameRoom = {
				id: "game" + client.id,
				status: false,
				player1: client.id,
				player2: null,
			}
			this.games.push(newGame);
			console.log("Client: ", client.id, " added to new Room: ", this.games[this.games.length - 1].id);
			client.join(newGame.id);
			status = false;
			this.server.to(this.games[this.games.length - 1].id).emit('gameStatus', status);
		}
		else {
			this.games[this.games.length - 1].player2 = client.id;
			this.games[this.games.length - 1].status = true;
			console.log("Client: ", client.id, " added to Room: ", this.games[this.games.length - 1].id);
			client.join(this.games[this.games.length - 1].id);
			status = true;
			this.server.to(this.games[this.games.length - 1].id).emit('gameStatus', status);
		}
		console.log(this.games[this.games.length - 1].id)
	}

	@SubscribeMessage('leaveGame')
	handleLeaveGame(client: Socket) {
		console.log(this.games.length);
		const index = this.games.findIndex((game: GameRoom) => {
			return game.player1 === client.id || game.player2 === client.id;
		})
		this.server.to(this.games[index].id).emit('gameStop', client.id);
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
				console.log("Room: ", this.games[index].id, " deleted.");
				this.games = [...this.games.slice(0, index), ...this.games.slice(index + 1)];
			}
		}
	}

	@SubscribeMessage('arrowDown')
	handleArrowDown(client: Socket, data: GameFront): void {
		let newPos: number;
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})
		if (index >= 0) {
			if (this.games[index].player1 === client.id) {
				newPos = data.playerleft.position.y + data.playerleft.velocity.y;
				if ((newPos + data.playerleft.height) > data.height) {
					newPos = data.height - data.playerleft.height;
				}
				this.server.to(this.games[index].id).emit('updateLeftPlayer', newPos);
			}
			else if (this.games[index].player2 === client.id) {
				newPos = data.playerright.position.y + data.playerright.velocity.y;
				if ((newPos + data.playerright.height) > data.height) {
					newPos = data.height - data.playerright.height;
				}
				this.server.to(this.games[index].id).emit('updateRightPlayer', newPos);
			}
		}
	}

	@SubscribeMessage('arrowUp')
	handleArrowUp(client: Socket, data: GameFront): void {
		let newPos: number;
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.player1 === client.id || game.player2 === client.id);
		})
		if (index >= 0) {
			if (this.games[index].player1 === client.id) {
				newPos = data.playerleft.position.y - data.playerleft.velocity.y;
				if (newPos < 0) {
					newPos = 0;
				}
				this.server.to(this.games[index].id).emit('updateLeftPlayer', newPos);
			}
			else if (this.games[index].player2 === client.id) {
				newPos = data.playerright.position.y - data.playerright.velocity.y;
				if (newPos < 0) {
					newPos = 0;
				}
				this.server.to(this.games[index].id).emit('updateRightPlayer', newPos);
			}
		}
	}

	//@SubscribeMessage('msgToServer')
	//handleMessage(client: Socket, data: any): void {
	//	this.logger.log(`Client sent: ${data}`);
	//	this.server.emit('msgToClient', data)
	//}

	afterInit(server: any) {
		this.logger.log('Init');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket, ...args: any[]) {
		console.log(this.games.length);
		const index = this.games.findIndex((game: GameRoom) => {
			return game.player1 === client.id || game.player2 === client.id;
		})
		if (index >= 0) {
			if (this.games[index].player1 === client.id)
				this.server.to(this.games[index].player2).emit('gameStop', this.games[index].player1);
			else if (this.games[index].player2 === client.id)
				this.server.to(this.games[index].player1).emit('gameStop', this.games[index].player2);
		}
		this.logger.log(`Client disconnected: ${client.id}`);
		this.handleDeleteRoom(client);
	}

}
