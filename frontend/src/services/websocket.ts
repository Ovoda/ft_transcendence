import { Socket, io } from "socket.io-client";

export function createMainSocket(): Socket {
    return io("ws://localhost:3001", { transports: ["websocket"] });
}

export function initSocket(socket: Socket, userId: string) {
    socket.on("connect", () => {
        console.log("socket connected");
    });
    socket.emit("RegisterClient", userId);
}