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