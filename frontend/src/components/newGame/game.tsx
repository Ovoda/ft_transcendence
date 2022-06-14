import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ClientSocket from "services/websocket.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import SynchronizeBallHitDto from "./interfaces/synchronizeBallHit.dto";

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface Player {
    x: number;
    y: number;
    velocity: number;
    height: number;
    width: number;
    side: boolean;
}

export default function Game() {

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const canvaRef = useCallback((node: any) => {
        if (node !== null) {
            setContext(node.getContext('2d'));
        }
    }, []);

    const { user } = useSelector((store: Store) => store);

    let isCurrentRight = false
    let currentGameRoomId = "";

    const mainSocket: ClientSocket | null = useContext(mainSocketContext);

    const players = [
        {
            x: 0,
            y: 200 - 80 / 2,
            velocity: 10,
            height: 80,
            width: 10,
            side: false,
        },
        {
            x: 600 - 10,
            y: 200 - 80 / 2,
            velocity: 10,
            height: 80,
            width: 10,
            side: true,
        }
    ];

    /** BALL */
    const ball: Ball = {
        x: 100,
        y: 100,
        vy: 5,
        vx: 6,
        radius: 5
    };

    function moveBall() {
        if ((ball.y <= 0 || ball.y >= 400) && (ball.x <= 0 || ball.x >= 600)) {
            ball.vx = -ball.vx;
            ball.vy = -ball.vy;
            ball.x = ball.x + ball.vx;
            ball.y = ball.y + ball.vy;
            mainSocket?.emit("synchronizeBallHit",
                { x: ball.x, y: ball.y, isRight: isCurrentRight, gameRoomId: currentGameRoomId } as SynchronizeBallHitDto);
            return;
        }

        if (ball.x <= 0 || ball.x >= 600) {
            ball.vx = -ball.vx;
            ball.x = ball.x + ball.vx;
            ball.y = ball.y + ball.vy;
            mainSocket?.emit("synchronizeBallHit",
                { x: ball.x, y: ball.y, isRight: isCurrentRight, gameRoomId: currentGameRoomId } as SynchronizeBallHitDto);
            return;
        }

        if (ball.y <= 0 || ball.y >= 400) {
            ball.vy = -ball.vy;
            ball.x = ball.x + ball.vx;
            ball.y = ball.y + ball.vy;
            mainSocket?.emit("synchronizeBallHit",
                { x: ball.x, y: ball.y, isRight: isCurrentRight, gameRoomId: currentGameRoomId } as SynchronizeBallHitDto);
            return;
        }

        ball.x = ball.x + ball.vx;
        ball.y = ball.y + ball.vy;
    }

    let goDown = false;
    let goUp = false;

    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            goDown = true;
            goUp = false;
        }
        if (event.key === "ArrowUp") {
            goDown = false;
            goUp = true;
        }
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
        goDown = false;
        goUp = false;
    });

    async function gameLoop() {
        if (!context) return;

        if (goDown) {
            players[0].y += players[0].velocity;
        }
        if (goUp) {
            players[0].y -= players[0].velocity;
        }

        context.fillStyle = "white";
        context.clearRect(0, 0, 600, 400);
        context.fillRect(0, 0, 600, 400);

        context.beginPath();
        context.fillStyle = "black";
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        context.fillStyle = "blue";
        context.fillRect(players[0].x, players[0].y, players[0].width, players[0].height);
        context.fillStyle = "red";
        context.fillRect(players[1].x, players[1].y, players[1].width, players[1].height);

        moveBall();

        setTimeout(() => {
            requestAnimationFrame(gameLoop);
        }, 10);
    }

    function startGame() {
        mainSocket?.emit("joinGame", {
            login: user.login,
            userId: user.id,
        });
    }

    const gameStartCallback = ({ isRight, gameRoomId }: { isRight: boolean, gameRoomId: string }) => {
        isCurrentRight = isRight;
        currentGameRoomId = gameRoomId;
        gameLoop();
    }

    const gameBallSyncCallback = ({ x, y }: { x: number, y: number }) => {
        ball.x = x;
        ball.y = y;
    }

    useEffect(() => {
        mainSocket?.on("gameStart", gameStartCallback);
        mainSocket?.on("ballSync", gameBallSyncCallback);

        return (() => {
            mainSocket?.off("gameStart", gameStartCallback);
            mainSocket?.off("ballSync", gameBallSyncCallback);
        });
    }, [context]);

    return (
        <>
            <button onClick={startGame}>start game</button>;
            <canvas ref={canvaRef} height={400} width={600}></canvas>
        </>
    )
}