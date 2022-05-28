import Player from './interfaces/player.interface';
import Ball from './interfaces/ball.interface';
import FixedGame from './interfaces/game.interface';
import { io, Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import './game.scss';

const socket: Socket = io("ws://localhost:3001");

//function animate() {
//	console.log("animate");
//	json = initGame(json);
//	console.log("init done");
//	requestAnimationFrame(animate)
//	if (json?.c && json?.canvas)
//	{
//		console.log("canvas");
//		json.c.clearRect(0, 0, json.canvas.width, json.canvas.height);
//		drawPlayers(json.canvas, json.c, json.keys_1, json.player1, json.keys_2, json.player2);
//		json.ball.update(json.c, json.canvas, json.player1, json.player2);
//	}
//}

function launch(Start: any, Ready: any) {
	Start(false);
	socket.emit("joinGame");
	socket.on("gameStatus", (data: any) => {
		console.log("Status of the game room", data);
		Ready(data);
		if (data == true) {
			//animate();
		}
	})
}

function leave(Start: any) {
	Start(true);
	socket.emit("leaveGame");
}

function Game() {
	const gameRef: FixedGame = {
		width: 1000,
		height: 600,
	}
	const canvaRef = useRef<HTMLCanvasElement>(null);
	const [start, setStart] = useState(true);
	const [ready, setReady] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [canvasWidth, setCanvasWidth] = useState(gameRef.width);
	const [canvasHeight, setCanvasHeight] = useState(gameRef.height);
	const [canvasContext, setContext] = useState(canvaRef.current?.getContext('2d'));
	const [ball, setBall] = useState<Ball>({
		velocity: {
			x: 3,
			y: 0,
		},
		position: {
			x: 500,
			y: 300,
		},
		radius: 5,

	})
	const [playerLeft, setPlayerLeft] = useState<Player>({
		score: 0,
		side: 'left',
		width: 5,
		height: 50,
		position: {
			x: 0,
			y: 150,
		},
		velocity: {
			x: 0,
			y: 3,
		}
	});
	const [playerRight, setPlayerRight] = useState<Player>({
		score: 0,
		side: 'right',
		width: 5,
		height: 50,
		position: {
			x: 1000 - 5,
			y: 150,
		},
		velocity: {
			x: 0,
			y: 3,
		}
	});
	//const [keyOne, setKeyOne] = useState(0);
	//const [keyTwo, setKeyTwo] = useState(0);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setWindowWidth(window.innerWidth);
		});
	}, []);

	useEffect(() => {
		setCanvasWidth(windowWidth * 0.7);
		setCanvasHeight(windowHeight * 0.7);
		setPlayerLeft({
			...playerLeft,
			width: (window.innerWidth * 0.7) / 50,
			height: (window.innerWidth * 0.7) / 3,
			position: {
				x: 0,
				y: 0,
			}
		})
		setPlayerRight({
			...playerRight,
			width: (window.innerWidth * 0.7) / 50,
			height: (window.innerWidth * 0.7) / 3,
			position: {
				x: 0,
				y: 0,
			}
		})
		setBall({
			...ball,
			radius: Math.sqrt(((0.2 * (window.innerWidth * 0.7) * (window.innerHeight * 0.7) / 100) / Math.PI)),
		})
	}, [windowWidth]);

	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			{start ? (
				<button onClick={() => launch(setStart, setReady)}>Start Game</button>
			) : (
				<button onClick={() => leave(setStart)}>Stop Game</button>
			)}
			<p></p>
			{!start && ready ? (
				<canvas ref={canvaRef} height={canvasHeight} width={canvasWidth} id="canvas"></canvas>
			) : (
				<p></p>
			)}
			{!start && !ready ? (
				<p>Waiting for another player...</p>
			) : (
				<p></p>
			)}
		</div>
	);
}

//window.addEventListener("keydown", function (event) {
//	switch (event.key) {
//		case "ArrowDown":
//			json.keys_1.down = true;
//			json.keys_2.down = true;
//			if (json.c && json.canvas)
//				{json.player1.update(json.c, json.keys_1, json.canvas);
//				json.player2.update(json.c, json.keys_2, json.canvas);}
//			break ;
//		case "ArrowUp":
//			json.keys_1.up = true;
//			json.keys_2.up = true;
//			if (json.c && json.canvas)
//				{json.player1.update(json.c, json.keys_1, json.canvas);
//				json.player2.update(json.c, json.keys_2, json.canvas);}
//			break ;
//		default:
//			return ;
//		}
//		event.preventDefault();
//	}, true);

export default Game;