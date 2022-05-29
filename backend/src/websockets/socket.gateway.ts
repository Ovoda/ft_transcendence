import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    transport: ['websocket'],
    cors: {
        origin: "*",
    }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    public handleConnection(@ConnectedSocket() client: Socket) {

    }

    public handleDisconnect(@ConnectedSocket() client: Socket) {

    }
}