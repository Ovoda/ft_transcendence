import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "./dtos/JoinRoom.dto";
import RegisterClientDto from "./dtos/RegisterClient.dto";
import SendChatMessageDto from "./dtos/SendChatMessageDto";
import ClientSocket from "./interfaces/Socket.interface";
import { remove } from 'lodash';

@WebSocketGateway({
    transport: ['websocket'],
    cors: {
        origin: "*",
    }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private events: ClientSocket[] = [];

    public handleConnection(@ConnectedSocket() client: Socket) {
    }

    public handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.removeClientSocket(socket);
    }

    @SubscribeMessage("RegisterClient")
    public registerClientSocket(socket: Socket, userId: string) {
        this.events.push({ socket, userId });
        console.log(`Registered client, new length : ${this.events.length}`);
    }

    @SubscribeMessage("RemoveClient")
    public removeClientSocket(socket: Socket) {

        remove(this.events, (event) => {
            event.socket.id === socket.id
        })
        console.log(`Removed client, new length : ${this.events.length}`);
    }

    @SubscribeMessage("ClientMessage")
    public sendMessage(socket: Socket, body: SendChatMessageDto) {
        console.log(body);

        const ret = this.server.to(body.room).emit("ServerMessage", body);
    }

    @SubscribeMessage("Join")
    public joinRoom(socket: Socket, body: JoinRoomDto) {
        socket.join(body.roomId);
        console.log(`Socket ${socket.id} joined room ${body.roomId}`);
    }
}