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
import JoinGameDto from "./dtos/joinGame.dto";
import SynchronizePlayerDto from "./dtos/synchronizePlayer.dto";
import NewRoundDto from "./dtos/newRound.dto";
import SynchronizeGameDto from "./dtos/synchronizeGame.dto";
import StopGameDto from "./dtos/stopGame.dto";
import WatchingRequestDto from "./dtos/watchingRequest.dto";
import GameWatchDto from "./dtos/gameWatch.dto";
import { ChatGroupService } from "src/chat/services/chatGroup.service.ts";

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
        private readonly groupService: ChatGroupService,
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
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        let event = this.events.find((event: ClientSocket) => event.socket.id === socket.id);
        if (!event) return;

        await this.userService.setUserAsDisconnected(event.userId);
        this.removeClientSocket(socket);

        const game = this.games.find((game: GameRoom) => {
            return game.socket1 === socket.id || game.socket2 === socket.id;
        })

        if (!game) { return; }

        await Promise.all(game.watchers.map(async (watcher: string) => {
            const event = this.events.find((event: ClientSocket) => event.socket.id === watcher);
            if (!event) return;
            await this.userService.setUserAsConnected(event.userId);
        }));
    
        const otherUserId = (game.user1 === event.userId) ? game.user2 : game.user1;
        this.server.to(game.id).emit('stopGame');
        await this.userService.setUserAsConnected(otherUserId);

        this.server.emit("UpdateUserRelations");
        _.remove(this.games, game);
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
        this.server.emit("UpdateUserRelations");
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


    /**
     * GAME LISTENERS
     */
    @SubscribeMessage('joinGame')
    async handleJoinGame(client: Socket, data: JoinGameDto) {
        const event = this.events.find((event: ClientSocket) => event.socket.id === client.id);

        if (!event) return;

        const user = await this.userService.findOneById(event.userId);

        const game = this.games.find((game: GameRoom) => {
            return (game.user1 === user.id || game.user2 === user.id);
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
                login1: user.username,
                login2: null,
                user1: user.id,
                user2: null,
                watchers: [],
                hard: data.hard,
                long: data.long,
                spin: data.spin,
            }
            this.games.push(newGame);

            await this.userService.setUserAsQueuing(user.id);

            client.join(newGame.id);
            this.server.emit("UpdateUserRelations");
        } else {
            const gameroom: GameRoom = this.games[this.games.length - 1];
            gameroom.socket2 = client.id;
            gameroom.user2 = user.id;
            gameroom.login2 = user.username;
            gameroom.status = true;

            await this.userService.setUserAsPlaying(gameroom.user1);
            await this.userService.setUserAsPlaying(gameroom.user2);

            this.server.emit("UpdateUserRelations");
            client.join(gameroom.id);
            this.server.to(gameroom.socket1).emit('gameStart', { isRight: true, gameRoomId: gameroom.id, hard: data.hard, long: data.long, spin: data.spin, logins: [gameroom.login1, gameroom.login2] });
            this.server.to(gameroom.socket2).emit('gameStart', { isRight: false, gameRoomId: gameroom.id, hard: data.hard, long: data.long, spin: data.spin, logins: [gameroom.login1, gameroom.login2] });
        }
    }


    /** GAME ANIMATIONS */
    flag = true;

    @SubscribeMessage("synchronizeGame")
    handleBallHitSync(client: Socket, data: SynchronizeGameDto) {
        if (this.flag) {
            this.server.to(data.gameRoomId).emit("synchronizeGame", data);
        }
        this.flag = !this.flag;
    }

    @SubscribeMessage('updatePlayer')
    handleArrow(client: Socket, data: SynchronizePlayerDto): void {
        this.server.to(data.gameRoomId).emit('updatePlayer', data);
    }

    @SubscribeMessage('newRound')
    handleResetScore(client: Socket, data: NewRoundDto) {
        this.server.to(data.gameRoomId).emit('newRound', data);
    }

    /**
     * GAME CONTROL
     */

    @SubscribeMessage('WatchingRequest')
    async handleWatchingRequest(client: Socket, data: WatchingRequestDto) {

        const watched = data.watched;
        const watcher = data.watcher;

        const game = this.games.find((game: GameRoom) => {
            return (game.user1 === watched || game.user2 === watched);
        })

        if (!game) { return; }

        if (game.watchers.find((watcherId) => watcherId === client.id)) return;


        game.watchers.push(client.id);

        await this.userService.setUserAsWatching(watcher);
        client.join(game.id);

        let logins: GameWatchDto = {
            left: game.login1,
            right: game.login2,
        }
        this.server.emit("UpdateUserRelations");
        this.server.to(client.id).emit("gameWatch", logins);
    }


    @SubscribeMessage('pauseGame')
    handlePauseGame(client: Socket, gameRoomId: string) {
        this.server.to(gameRoomId).emit('pauseGame');
    }


    @SubscribeMessage('resumeGame')
    handleResumeGame(client: Socket, gameRoomId: string) {
        this.server.to(gameRoomId).emit('resumeGame');
    }


    @SubscribeMessage('stopWaitingGame')
    async handleStopWaitingGame(client: Socket, gameRoomId: string) {
        const room = this.games.find((game: GameRoom) =>
            game.socket1 === client.id || game.socket2 === client.id);

        if (!room) { return; }

        client.leave(room.id);

        _.remove(this.games, room);

        const event = this.events.find((event: ClientSocket) => event.socket.id === client.id);
        if (!event) return;

        await this.userService.setUserAsConnected(event.userId);
        this.server.emit("UpdateUserRelations");
    }

    @SubscribeMessage('stopGame')
    async handleStopGame(client: Socket, stopGameDto: StopGameDto) {

        const room = this.games.find((game: GameRoom) => game.id === stopGameDto.gameRoomId);
        if (!room) {
            return;
        }

        let updateStatsDto: UpdateStatsDto = {
            winnerId: (stopGameDto.scores[0] < stopGameDto.scores[1]) ? room.user1 : room.user2,
            loserId: (stopGameDto.scores[0] > stopGameDto.scores[1]) ? room.user1 : room.user2,
        }

        this.server.to(stopGameDto.gameRoomId).emit('stopGame', client.id);

        client.leave(room.id);
        await this.userService.setUserAsConnected(room.user1);

        client.leave(room.id);
        await this.userService.setUserAsConnected(room.user2);

        await Promise.all(room.watchers.map(async (watcher: string) => {
            const event = this.events.find((event: ClientSocket) => event.socket.id === watcher);
            if (!event) return;
            await this.userService.setUserAsConnected(event.userId);
        }));

        this.server.emit("UpdateUserRelations");

        _.remove(this.games, room);

        if (updateStatsDto.winnerId !== null && updateStatsDto.loserId !== null) {
            await this.gameService.saveNewStats(updateStatsDto);
        }

        this.server.to(room.socket1).emit("UpdateUserData");
        this.server.to(room.socket2).emit("UpdateUserData");
    }

    @SubscribeMessage('stopWatching')
    async handleStopWatching(client: Socket) {
        const gameIndex = this.games.findIndex((gameRoom: GameRoom) => gameRoom.watchers.includes(client.id));
        client.leave(this.games[gameIndex].id);
        const watcherIndex = this.games[gameIndex].watchers.findIndex((watcher: string) => watcher === client.id);
        this.games[gameIndex].watchers = [...this.games[gameIndex].watchers.slice(0, watcherIndex), ...this.games[gameIndex].watchers.slice(watcherIndex + 1)];

        const event = this.events.find((event: ClientSocket) => event.socket.id === client.id);
        await this.userService.setUserAsConnected(event.userId);
        this.server.emit("UpdateUserRelations");
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

    @SubscribeMessage("cancelPrivateGame")
    async cancelPrivateGame(client: Socket, requestedUserId: string) {

        if (!requestedUserId) return;

        const event = this.events.find((event: ClientSocket) => {
            return event.userId === requestedUserId;
        });

        this.server.to(event.socket.id).emit("cancelPrivateGame");
        this.server.to(client.id).emit("cancelPrivateGame");
    }

    @SubscribeMessage("privateGameResponse")
    async handlePrivateGameResponse(client: Socket, data: any) {

        if (!data.userId) return;

        const event2 = this.events.find((event: ClientSocket) => {
            return event.socket.id === client.id;
        });
        const user2 = await this.userService.findOneById(event2.userId);

        const event1 = this.events.find((event: ClientSocket) => {
            return event.userId === data.userId;
        });
        const user1 = await this.userService.findOneById(event1.userId);

        if (!data.status) {
            this.server.to(event1.socket.id).emit("UserResponseDecline");
            return;
        };

        const newGame: GameRoom = {
            id: "game" + event1.socket.id,
            status: true,
            socket1: event1.socket.id,
            socket2: event2.socket.id,
            login1: user1.username,
            login2: user2.username,
            user1: user1.id,
            user2: user2.id,
            watchers: [],
        }

        this.games.push(newGame);

        event1.socket.join(newGame.id);
        event2.socket.join(newGame.id);

        await this.userService.setUserAsPlaying(newGame.user1);
        await this.userService.setUserAsPlaying(newGame.user2);
        this.server.emit("UpdateUserRelations");

        this.server.to(newGame.socket1).emit('gameStart', { isRight: true, gameRoomId: newGame.id, hard: data.hard, long: data.long, spin: data.spin, logins: [newGame.login1, newGame.login2] });
        this.server.to(newGame.socket2).emit('gameStart', { isRight: false, gameRoomId: newGame.id, hard: data.hard, long: data.long, spin: data.spin, logins: [newGame.login1, newGame.login2] });
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


    async updateGroupImage(groupId: string) {
        const group = await this.groupService.findOneById(groupId, {
            relations: ["users"],
        });

        if (!group.users) return;
        group.users.forEach((role: ChatRoleEntity) => {
            const event = this.events.find((event: ClientSocket) => event.userId === role.user.id);
            if (!event) return;
            this.server.to(event.socket.id).emit("UpdateUserRoles");
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
            this.server.emit("UpdateUserRelations");
            return;
        }
        const event = this.events.find((event: ClientSocket) => event.userId === userId);
        if (event) {
            this.server.to(event.socket.id).emit("UpdateUserRelations");
        }
    }

    public emitToSocketRoom(groupId: string, eventName: string, eventCallback: () => void = null) {
        if (eventCallback) {
            this.server.to(groupId).emit(eventName, eventCallback);
            return;
        }
        this.server.to(groupId).emit(eventName);
    }



    /** NICO */
    @SubscribeMessage("closingChat")
    public closingChat(client: Socket, userId: string) {
        this.server.emit("closingChat", userId);
    }

    @SubscribeMessage("updateRoles")
    public dispatchNewRoles(client: Socket, groupId: string) {
        this.server.emit("updateRoles");
    }
}