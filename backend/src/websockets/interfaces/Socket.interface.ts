import { Socket } from "socket.io";

export default interface ClientSocket {
    socket: Socket;
    userId: string;
}