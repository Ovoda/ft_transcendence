import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import RegisterClientDto from "./dtos/RegisterClient.dto";
import ClientSocket from "./interfaces/Socket.interface";

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
        console.log(this.events.length);
    }

    @SubscribeMessage("RemoveClient")
    public removeClientSocket(socket: Socket) {

        const socketIndex = this.events.findIndex((event) => {
            return (event.socket.id === socket.id);
        })

        console.log(`index is ${socketIndex}`);

        if (socketIndex)

            this.events = [...this.events.slice(0, socketIndex), ...this.events.slice(socketIndex + 1)];
        console.log(this.events.length);
    }
}