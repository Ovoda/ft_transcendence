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
import { Game, Games } from '../types/game.interface'
import { rootCertificates } from "tls";


@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
	},
})


export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private games: Games = {
		size: 0,
		rooms: [],
	}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway')

	@SubscribeMessage('newGame')
	handleNewGame(client: Socket, message: { sender: string, room: string, message: string }): void {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.server.to(message.room).emit('startingGame', "message");
		// client.join()
	}

	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket) {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.logger.log(`Current: ${this.games.size}`);
		let status: boolean;
		if (!this.games.size || this.games.rooms[this.games.size - 1].status === true) {
			const newGame: Game = {
				id: client.id,
				status: false,
				player1: client.id,
				player2: null,
			}
			this.games.rooms.push(newGame);
			client.join(client.id);
			status = false;
			this.games.size++;
		}
		else if (this.games.rooms[this.games.size - 1].status === false) {
			this.games.rooms[this.games.size - 1].player2 = client.id;
			this.games.rooms[this.games.size - 1].status = true;
			client.join(this.games.rooms[this.games.size - 1].id);
			status = true;
		}
		this.server.emit('gameStatus', status);
	}

	@SubscribeMessage('leave')
	handleLeaveGame(client: Socket, room: string) {
		client.leave(room);
		client.emit('leavedRoom', room);
	}


	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, data: any): void {
		this.logger.log(`Client sent: ${data}`);
		this.server.emit('msgToClient', data)
	}

	afterInit(server: any) {
		this.logger.log('Init');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket, ...args: any[]) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}
}


