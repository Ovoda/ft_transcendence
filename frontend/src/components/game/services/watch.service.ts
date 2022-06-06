import { useContext, useEffect, useRef, useState } from "react";
import { mainSocketContext } from '../../../App';
import ClientSocket from "services/websocket";

export function watchingRequest(login: string, socket: ClientSocket | null) {

	console.log(login);
	socket?.emit("watchingRequest", login);
}