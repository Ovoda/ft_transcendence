import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import Chat from "features/chat/interfaces/chat.interface";
import RolesSlice from "features/roles/interfaces/roles.interface";
import { Socket, io } from "socket.io-client";
import Dm from "src/shared/interfaces/dm.interface";
import GroupMessage from "src/shared/interfaces/groupMessage.interface";
import UserRole from "src/shared/interfaces/role.interface";

/**
 * @class ClientSocket
 * ClientSocket is a customized superset of the basic websocket object (Socket from socket-io).
 * @function init
 * @function on
 * @function emit
 * @function joinRoom
 * @function leaveRoom
 * @function leaveGame
 */
export default class ClientSocket {

	/** Inner websocket object */
	public socket: Socket = io(process.env.REACT_APP_BACKEND_WS_URL as string, { transports: ["websocket"] });;

	/** Current client socket id */
	public id = this.socket.id;

	public chat: Chat | null = null;

	public dispatch: Dispatch<AnyAction> | null = null;

	/**
	 * Initialize a socket registering it on the server for chat, user and game events
	 * @param userId current user id
	 */
	public init(userId: string) {
		this.socket.emit("RegisterClient", userId);
	}

	/**
	 * Listen for a specific websocket event
	 * @param event event to listen to 
	 * @param fun callball function, triggered when event occurs
	 */
	public on(event: string, fun: any) {
		this.socket.on(event, fun);
	}

	public off(event: string, fun: any) {
		this.socket.off(event, fun);
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
	public sendDm(message: Dm) {
		this.socket.emit("ClientDm", message);
	}

	/**
	 * Sends a message to the websocket server
	 * @param message message to send
	 */
	public sendGroupMessage(message: GroupMessage) {
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

	public joinDm(relationId: string) {
		this.socket.emit("JoinDm", relationId);
	}

	public leaveDm(relationId: string) {
		this.socket.emit("LeaveDm", relationId);
	}

	/** Leaves the current game */
	public leaveGame(data: number[]) {
		this.socket.emit("LeaveGame", data);
	}

	/** Watching request on given friend */
	public watchingRequest(data: any) {
		this.socket.emit("WatchingRequest", data);
	}

	public playingRequest(data: any) {
		this.socket.emit("playingRequest", data);
	}

	public closingChat(userId: string) {
		this.socket.emit("closingChat", userId);
	}

	public reloadRoles(data: any) {
		this.socket.emit("updateRoles", data);
	}
}