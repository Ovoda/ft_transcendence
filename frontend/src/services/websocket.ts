import { Socket, io } from "socket.io-client";
import Message from "src/shared/interfaces/Message";
import SendChatMessageDto from "./interfaces/SendMessageDto";

export default class ClientSocket {
    socket: Socket = io("ws://localhost:3001", { transports: ["websocket"] });;

    public initSocket(userId: string) {
        this.socket.on("connect", () => {
            this.socket.emit("RegisterClient", userId);
        });
    }

    public on(event: string, fun: any) {
        return (this.socket.on(event, fun));
    }

    public sendMessage(body: Message) {
        this.socket.emit("ClientMessage", body);
    }

    public joinRoom(roomId: string) {
        this.socket.emit("Join", { roomId });
    }
}