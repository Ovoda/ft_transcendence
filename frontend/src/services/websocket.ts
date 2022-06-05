import { Socket, io } from "socket.io-client";
import SendChatMessageDto from "src/shared/interfaces/Message";

/**
 * @class ClientSocket
 * ClientSocket is a customized superset of the basic websocket object (Socket from socket-io).
 * @function init
 * @function on
 * @function emit
 * @function sendMessage
 * @function joinRoom
 * @function leaveRoom
 * @function leaveGame
 */
export default class ClientSocket {
    /**
     * Inner websocket object
     */
    public socket: Socket = io(process.env.REACT_APP_BACKEND_WS_URL as string, { transports: ["websocket"] });;

    /**
     * Current socket id
     */
    public id = this.socket.id;

    /**
     * Initialize a socket registering it on the server for chat, user and game events
     * @param userId current user id
     */
    public init(userId: string) {
        this.socket.on("connect", () => {
            this.socket.emit("RegisterClient", userId);
        });
    }

    /**
     * Listen for a specific websocket event
     * @param event event to listen to 
     * @param fun callball function, triggered when event occurs
     */
    public on(event: string, fun: any) {
        this.socket.on(event, fun);
    }

    /**
     * Emits a specific websocket event
     * @param event event to send
     * @param data (optional) data to send to the event 
     */
    public emit(event: string, data?: any) {
        this.socket.emit(event, data);
    }

    /**
     * Sends a message to the websocket server
     * @param message message to send
     */
    public sendMessage(message: SendChatMessageDto) {
        this.socket.emit("ClientMessage", message);
    }

    /**
     * Joins a given chat room
     * @param roomId ID of the room to join
     */
    public joinRoom(roomId: string) {
        this.socket.emit("JoinRoom", { roomId });
    }

    /**
     * Leaves a given chat room
     * @param roomId ID of the room to leave
     */
    public leaveRoom(roomId: string) {
        this.socket.emit("LeaveRoom", { roomId })
    }

    /**
     * Leaves the current game
     */
    public leaveGame() {
        // BRUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUH !!!!!!!!!!!!!
        this.socket.emit("leaveGame");
    }

}