import { Socket, io } from "socket.io-client";
import { socketContext } from "src/App";
import Message from "src/shared/interfaces/Message";
import SendChatMessageDto from "./interfaces/SendMessageDto";

export default class ClientSocket {
    socket: Socket = io(process.env.REACT_APP_BACKEND_WS_URL as string, { transports: ["websocket"] });;

    public id = this.socket.id;

    public initSocket(userId: string) {
        this.socket.on("connect", () => {
            this.socket.emit("RegisterClient", userId);
        });
    }

    public on(event: string, fun: any) {
        return (this.socket.on(event, fun));
    }

    public emit(event: string, data?: any) {
        return (this.socket.emit(event, data));
    }

    public sendMessage(body: Message) {
        this.socket.emit("ClientMessage", body);
    }

    public joinRoom(roomId: string) {
        this.socket.emit("Join", { roomId });
    }

    public leaveGame() {
		// BRUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUH !!!!!!!!!!!!!
        this.socket.emit("leaveGame");
    }

}