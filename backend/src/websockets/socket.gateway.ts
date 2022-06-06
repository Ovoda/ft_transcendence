import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "./dtos/JoinRoom.dto";
import ClientSocket from "./interfaces/Socket.interface";
import { remove } from 'lodash';
import { LeaveRoomDto } from "./dtos/LeaveRoom.dto";
import ClientMessageDto from "./dtos/ClientMessage.dto";
import { ChatRoleService } from "src/chat/services/chatRole.service";

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
        //private readonly chatRoomService: ChatRoomService,
		private readonly chatRoleService: ChatRoleService,
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
        this.events.push({ socket, userId });
    }

    /**
     * Removes specific client from event array
     * @listens
     * @param socket client's socket to remove
     */
    @SubscribeMessage("RemoveClient")
    public removeClientSocket(socket: Socket) {

        remove(this.events, (event) => {
            event.socket.id === socket.id
        })
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
        // await this.chatRoomService.postChatRoomMessage({
        //     content: body.content,
        //     login: body.login,
        //     date: body.date,
        //     avatar: body.avatar,
        // }, body.room);
		await this.chatRoleService.postMessageFromRole(body.userId, body.roleId, {
			content: body.content,
			login: body.login,
			avatar: body.avatar,
			date: body.date,
		});
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
}