import ClientSocket from "services/websocket.service";

export async function watchingRequest(login: string, socket: ClientSocket | null) {

	console.log("Watching Request for player: ");
	console.log(login);
	socket?.emit("watchingRequest", login);
	return true;
}