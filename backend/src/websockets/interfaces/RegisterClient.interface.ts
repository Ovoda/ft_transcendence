import { Socket } from "socket.io";

export default interface RegisterClientDto {
    socket: Socket;
    userId: string;
}