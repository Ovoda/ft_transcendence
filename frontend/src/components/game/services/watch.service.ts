import { useContext, useEffect, useRef, useState } from "react";
import { mainSocketContext } from '../../../App';
import ClientSocket from "services/websocket.service";

export function watchingRequest(login: string, socket: ClientSocket | null) {

	console.log("Watching Request for player: ");
	console.log(login);
	socket?.emit("watchingRequest", login);
}