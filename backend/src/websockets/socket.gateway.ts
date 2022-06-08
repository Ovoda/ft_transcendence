import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "./dtos/JoinRoom.dto";
import ClientSocket from "./interfaces/Socket.interface";
import { LeaveRoomDto } from "./dtos/LeaveRoom.dto";
import ClientMessageDto from "./dtos/ClientMessage.dto";
import { ChatRoleService } from "src/chat/services/chatRole.service";

import * as _ from "lodash";
import { ChatMessageService } from "src/chat/services/chatMessage.service";
import ClientDmDto from "./dtos/clientDm.dto";
import { RelationService } from "src/relation/relation.service";
import AddFriendDto from "./dtos/addFriend.dto";
import { Req, UseGuards } from "@nestjs/common";
import { TfaGuard } from "src/auth/guards/tfa.auth.guard";
import { JwtRequest } from "src/auth/interfaces/jwtRequest.interface";
import RelationEntity from "src/relation/entities/relation.entity";
import { UserService } from "src/user/user.service";

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
        private readonly chatRoleService: ChatRoleService,
        private readonly chatMessageService: ChatMessageService,
        private readonly relationService: RelationService,
        private readonly userService: UserService,
    ) { }

    /** Websocket server */
    @WebSocketServer()
    private server: Server;

    /** Array of registered events */
    private events: ClientSocket[] = [];

    /**
     * Handles client disconnection, removes corressponding event from events array
     * @param socket 
     */
    public handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.removeClientSocket(socket);
    }

    /**
     * Creates an event and registers it in the events array
     * @listens
     * @param socket client's socket
     * @param userId client's user ID
     */
    @SubscribeMessage("RegisterClient")
    public registerClientSocket(socket: Socket, userId: string) {
        this.userService.setUserAsConnected(userId);
        this.events.push({ socket, userId });
        this.server.emit("FriendConnection", userId);
    }

    /**
     * Removes specific client from event array
     * @listens
     * @param socket client's socket to remove
     */
    @SubscribeMessage("RemoveClient")
    public removeClientSocket(socket: Socket) {
        const event = this.events.find((event: ClientSocket) => {
            return event.socket.id === socket.id;
        });

        if (!event) return;

        this.userService.setUserAsDisconnected(event.userId);
        this.server.emit("FriendDisconnection", event.userId);
        _.remove(this.events, event);
    }

    /**
     * Handles clients chat messages post requests
     * @listens
     * @param socket client's socket
     * @param body request content
     */
    @SubscribeMessage("ClientMessage")
    public async sendMessage(socket: Socket, body: ClientMessageDto) {
        this.server.to(body.room).emit("ServerMessage", body);
        await this.chatRoleService.postMessageFromRole(body.userId, body.roleId, {
            content: body.content,
            login: body.login,
            avatar: body.avatar,
            date: body.date,
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
        this.server.to(body.relation.id).emit("ServerMessage", body);

        const relation = await this.relationService.findOneById(body.relation.id);

        const newDm = await this.chatMessageService.save({
            content: body.content,
            login: body.login,
            date: body.date,
            prev_message: relation.lastMessage,
            avatar: body.avatar,
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

    async addFriend(relation: RelationEntity) {
        const clients = this.events.filter((event: ClientSocket) =>
            (event.userId === relation.users[0].id) || (event.userId === relation.users[1].id)
        );

        clients.map((client: ClientSocket) => {
            this.server.to(client.socket.id).emit("NewFriend", {
                ...relation, counterPart: this.relationService.getCounterPart(relation.users, client.userId)
            });
        })
    }
}