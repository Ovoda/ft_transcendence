import { ConnectedSocket, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "./interfaces/JoinRoom.interface";
import ClientSocket from "./interfaces/Socket.interface";
import { LeaveRoomDto } from "./interfaces/LeaveRoom.interface";
import { ChatRoleService } from "src/chat/services/chatRole.service";
import * as _ from "lodash";
import { ChatMessageService } from "src/chat/services/chatMessage.service";
import ClientDmDto from "./dtos/clientDm.dto";
import { RelationService } from "src/relation/relation.service";
import RelationEntity from "src/relation/entities/relation.entity";
import { UserService } from "src/user/user.service";
import ClientGroupMessageDto from "./dtos/clientGroupMessage.dto";
import { RoleTypeEnum } from "src/chat/types/role.type";
import { forwardRef, Inject } from "@nestjs/common";
import { ChatGroupEntity } from "src/chat/entities/chatGroup.entity";
import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import { Message } from "src/chat/interfaces/message.interface";
import { GameRoom } from "src/game/types/gameRoom.interface";
import { UpdateStatsDto } from "src/game/dtos/updateStats.dto";
import { GameService } from "src/game/services/game.service";
import { SocketAddress } from "net";

/**
 * This class is a websocket gateway.
 * Just like a controller it handles requests and responses,
 * but for the websockets protocol
 * @class SocketGateway
 * @function handleDisconnect
 * @function registerClientSocket
 * @function removeClientSocket
 * @function sendMessage
 * @function joinRoom
 * @function leaveRoom
 */
@WebSocketGateway({
	transport: ['websocket'],
	cors: {
		origin: "*",
	}
})

export class SocketGateway implements OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => ChatRoleService))
		private readonly chatRoleService: ChatRoleService,
		private readonly chatMessageService: ChatMessageService,
		private readonly relationService: RelationService,
		private readonly userService: UserService,
		private readonly gameService: GameService,
	) { }

	/** Websocket server */
	@WebSocketServer()
	private server: Server;

	/** Array of registered events */
	private events: ClientSocket[] = [];
	private games: GameRoom[] = [];

	/**
	 * Handles client disconnection, removes corressponding event from events array
	 * @param socket 
	 */
	public handleDisconnect(@ConnectedSocket() socket: Socket) {

		this.removeClientSocket(socket);


		const game = this.games.find((game: GameRoom) => {
			return game.socket1 === socket.id || game.socket2 === socket.id;
		})

		if (!game) { return; }

		if (game.socket1 === socket.id) {
			if (game.user2) {
				this.server.to(game.socket2).emit('gameStop', game.socket1);
			}
		} else if (game.socket2 === socket.id) {
			if (game.user1) {
				this.server.to(game.socket1).emit('gameStop', game.socket2);
			}
		}
		this.handleDeleteRoom(socket);
	}

	/**
	 * Creates an event and registers it in the events array
	 * @listens
	 * @param socket client's socket
	 * @param userId client's user ID
	 * 
	 */
	@SubscribeMessage("RegisterClient")
	async registerClientSocket(socket: Socket, userId: string) {
		await this.userService.setUserAsConnected(userId);
		this.events.push({ socket, userId });
		this.server.emit("UpdateUserRelations", userId);
	}

	/**
	 * Removes specific client from event array
	 * @listens
	 * @param socket client's socket to remove
	 */
	@SubscribeMessage("RemoveClient")
	async removeClientSocket(socket: Socket) {
		const event = this.events.find((event: ClientSocket) => {
			return event.socket.id === socket.id;
		});

		if (!event) return;

		await this.userService.setUserAsDisconnected(event.userId);
		this.server.emit("UpdateUserRelations", event.userId);
		_.remove(this.events, event);
	}

	/**
	 * Handles clients chat messages post requests
	 * @listens
	 * @param socket client's socket
	 * @param body request content
	 */
	@SubscribeMessage("ClientMessage")
	public async sendMessage(socket: Socket, body: ClientGroupMessageDto) {

		const user = await this.userService.findOne({
			where: {
				id: body.userId,
			},
			relations: ["roles"]
		});

		if (!user) return;

		const role = await this.chatRoleService.findOneById(body.role.id);

		if (role.role === RoleTypeEnum.MUTE) return;
		if (role.role === RoleTypeEnum.BANNED) return;

		body.avatar = user.avatar;
		body.username = user.username;
		this.server.to(body.role.chatGroup.id).emit("ServerGroupMessage", body);
		await this.chatRoleService.uploadRoleFromExpiration(body.role.id);
		return await this.chatRoleService.postMessageFromRole(body.role.user.id, body.role.id, {
			content: body.content,
			date: body.date,
			userId: body.userId,
		});
	}

	/**
	 * Handles clients chat DM messages post requests
	 * @listens
	 * @param socket client's socket
	 * @param body request content
	 */


	@SubscribeMessage("ClientDm")
	public async sendDmMessage(socket: Socket, body: ClientDmDto) {

		const relation = await this.relationService.findOneById(body.relation.id);

		const register = await this.chatMessageService.save({
			content: body.content,
			date: body.date,
			prev_message: relation.lastMessage,
			userId: body.userId,
		});

		const newDm: Message = {
			id: register.id,
			content: body.content,
			username: body.username,
			date: body.date,
			prev_message: relation.lastMessage,
			avatar: body.avatar,
		}

		this.server.to(body.relation.id).emit("ServerMessage", {
			...newDm,
			relation: body.relation,
		});

		await this.relationService.updateById(body.relation.id, {
			lastMessage: newDm.id,
		});

		return newDm;
	}

	/**
	 * Makes a client socket join a specific room
	 * @listens
	 * @param socket client's socket
	 * @param body room ID of the room to join
	 */
	@SubscribeMessage("JoinRoom")
	public joinRoom(socket: Socket, body: JoinRoomDto) {
		socket.join(body.roomId);
	}

	/**
	 * Makes a client socket leave a specific room
	 * @listens
	 * @param socket client's socket
	 * @param body room ID of the room to leave
	 */
	@SubscribeMessage("LeaveRoom")
	public leaveRoom(socket: Socket, body: LeaveRoomDto) {
		socket.leave(body.roomId);
	}


	@SubscribeMessage("JoinDm")
	public joinDm(socket: Socket, relationId: string) {
		socket.join(relationId);
	}

	@SubscribeMessage("LeaveDm")
	public leaveDm(socket: Socket, relationId: string) {
		socket.leave(relationId);
	}

	async addFriend(relation: RelationEntity) {
		const clients = this.events.filter((event: ClientSocket) =>
			(event.userId === relation.users[0].id) || (event.userId === relation.users[1].id)
		);

		clients.map((client: ClientSocket) => {
			this.server.to(client.socket.id).emit("UpdateUserRelations");
		})
	}



	@SubscribeMessage('joinGame')
	async handleJoinGame(client: Socket, data: any) {
		//this.logger.log(`New Game Request from: ${client.id}, ${data.login}, ${data.id}`);

		const game = this.games.find((game: GameRoom) => {
			return (game.user1 === data.id || game.user2 === data.id);
		});

		if (game) {
			this.server.to(client.id).emit('GameAlert', "You already have an ongoing game.");
			return;
		}

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
		this.server.to(client.id).emit("setLogin", logins);
	}


	@SubscribeMessage('pauseGameRequest')
	handlePauseRequest(client: Socket) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})

		if (index < 0) { return; }

		this.server.to(this.games[index].id).emit('pauseGame');
	}


	@SubscribeMessage('resumeGameRequest')
	handleResumeRequest(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})

		if (index < 0) { return; }

		this.server.to(this.games[index].id).emit("resumeGame", data);
	}

	@SubscribeMessage('resetGame')
	handleResetScore(client: Socket, data: any) {
		const index = this.games.findIndex((game: GameRoom) => {
			return (game.socket1 === client.id || game.socket2 === client.id);
		})

		if (index < 0) { return; }

		this.server.to(this.games[index].id).emit('updateScore', data);
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
		if (data.winnerId !== null && data.loserId !== null) {
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


	@SubscribeMessage("playingRequest")
	async handlePlayingRequest(client: Socket, data: any) {

		const event_requesting = this.events.find((event: ClientSocket) => {
			return event.userId === data.userRequesting;
		});

		const event_requested = this.events.find((event: ClientSocket) => {
			return event.userId === data.userRequested;
		});

		if (!event_requested || !event_requesting) return;

		const user = await this.userService.findOneById(event_requesting.userId);

		this.server.to(event_requested.socket.id).emit("playingRequest", user);
	}

	@SubscribeMessage("privateGameResponse")
	async handlePrivateGameResponse(client: Socket, data: any) {

		if (!data.status) { return };

		const event2 = this.events.find((event: ClientSocket) => {
			return event.socket.id === client.id;
		});
		const user2 = await this.userService.findOneById(event2.userId);

		const event1 = this.events.find((event: ClientSocket) => {
			return event.userId === data.userId;
		});
		const user1 = await this.userService.findOneById(event1.userId);

		const newGame: GameRoom = {
			id: "game" + event1.socket.id,
			status: true,
			socket1: event1.socket.id,
			socket2: event2.socket.id,
			login1: user1.login,
			login2: user2.login,
			user1: user1.id,
			user2: user2.id,
			watchers: [],
		}

		this.games.push(newGame);

		event1.socket.join(newGame.id);
		event2.socket.join(newGame.id);

		await this.userService.setUserAsPlaying(newGame.user1);
		await this.userService.setUserAsPlaying(newGame.user2);
		this.server.emit("FriendConnection", newGame.user1);
		this.server.emit("FriendConnection", newGame.user2);

		this.server.to(newGame.socket1).emit('setSide', "left");
		this.server.to(newGame.socket2).emit('setSide', "right");
		this.server.to(newGame.id).emit('rightLogin', newGame.login2);
		this.server.to(newGame.id).emit('leftLogin', newGame.login1);
		this.server.to(newGame.id).emit('gameStatus', true);
	}

	async addGroup(group: ChatGroupEntity) {
		const clients = this.events.filter((event: ClientSocket) => {
			if (group.users.find((role: ChatRoleEntity) => role.user.id === event.userId)) {
				return event;
			}
		})

		clients.map((client: ClientSocket) => {
			this.server.to(client.socket.id).emit("UpdateUserRoles");
		})
	}

	public updateRoles(newRole: RoleTypeEnum | null, groupName: string, userId: string) {
		const event = this.events.find((event: ClientSocket) => event.userId === userId);

		if (!newRole) {
			this.server.to(event.socket.id).emit("UpdateUserRoles");
		}

		let message = "";

		if (newRole === RoleTypeEnum.BANNED) {
			message = `You've been banned from ${groupName}`
		}
		if (newRole === RoleTypeEnum.MUTE) {
			message = `You've been muted from ${groupName}`
		}
		if (newRole === RoleTypeEnum.ADMIN) {
			message = `You're now admin in ${groupName}`
		}
		if (newRole === RoleTypeEnum.LAMBDA) {
			message = `You're now a lambda user in ${groupName}`
		}


		if (!event) return;
		this.server.to(event.socket.id).emit("UpdateUserRoles", message);
	}

	public updateRelations(userId: string | null = null) {
		if (!userId) {
			this.server.emit("UpdateUserRelations", userId);
			return;
		}
		const event = this.events.find((event: ClientSocket) => event.userId === userId);
		if (event) {
			this.server.to(event.socket.id).emit("UpdateUserRelations", userId);
		}
	}

	public emitToSocketRoom(groupId: string, eventName: string, eventCallback: () => void = null) {
		if (eventCallback) {
			this.server.to(groupId).emit(eventName, eventCallback);
			return;
		}
		this.server.to(groupId).emit(eventName);
	}
}