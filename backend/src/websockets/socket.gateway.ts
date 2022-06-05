import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "./dtos/JoinRoom.dto";
import ClientSocket from "./interfaces/Socket.interface";
import { remove } from 'lodash';
import { LeaveRoomDto } from "./dtos/LeaveRoom.dto";
import ClientMessageDto from "./dtos/ClientMessage.dto";
import { ChatRoomService } from "src/chat/services/chatRoom.service";

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
        private readonly chatRoomService: ChatRoomService,
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
        console.log(`Sent message : ${body.content} to room : ${body.room}`);
        this.server.to(body.room).emit("ServerMessage", body);
        await this.chatRoomService.postChatRoomMessage({
            message: body.content,
            userId: body.from,
        }, body.room);
    }

    /**
     * Makes a client socket join a specific room
     * @listens
     * @param socket client's socket
     * @param body room ID of the room to join
     */
    @SubscribeMessage("JoinRoom")
    public joinRoom(socket: Socket, body: JoinRoomDto) {
        console.log(`Joined room ${body.roomId}`);
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
        console.log(`Left room ${body.roomId}`);
        socket.leave(body.roomId);
    }
}