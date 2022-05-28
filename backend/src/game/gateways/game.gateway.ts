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
import { Game} from '../types/game.interface'
import { rootCertificates } from "tls";
import { throws } from "assert";


@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
	},
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private games: Game[] = [];

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway')


	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, message: string) {
		this.logger.log(`New Game Request from: ${client.id}`);
		this.logger.log(`Current: ${this.games.length}`);
		let status: boolean;
		if (!this.games.length|| this.games[this.games.length - 1].status === true) {
			const newGame: Game = {
				id: client.id,
				status: false,
				player1: client.id,
				player2: null,
			}
			this.games.push(newGame);
			client.join(client.id);
			status = false;
		}
		else if (this.games[this.games.length - 1].status === false) {
			this.games[this.games.length - 1].player2 = client.id;
			this.games[this.games.length - 1].status = true;
			client.join(this.games[this.games.length - 1].id);
			status = true;
		}
		this.server.emit('gameStatus', status);
	}

	@SubscribeMessage('leaveGame')
	handleLeaveGame(client: Socket) {
		console.log(this.games.length);
		const index = this.games.findIndex((game: Game) => {
			return game.player1 === client.id || game.player2 === client.id;
		})
		this.server.to(this.games[index].id).emit('gameStop');
		this.games = [...this.games.slice(0, index), ...this.games.slice(index + 1)];
		//(this.games[index].player2).leave(this.games[index].id);
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


