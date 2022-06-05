import { Socket } from "socket.io";

/**
 * ClientSocket is a direct link between a socket and a user
 * @interface ClientSocket
 * @field socket: Socket - socket object to link
 * @field userId: string - id of the user to link
 */
export default interface ClientSocket {
    socket: Socket;
    userId: string;
}