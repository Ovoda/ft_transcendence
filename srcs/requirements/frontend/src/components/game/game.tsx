import { Ball } from './ball/ball';
import { Player } from './player/player';
import { Keys } from './player/player';
import { drawPlayers } from './player/player';
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import './game.scss';

const socket : Socket = io("ws://localhost:3001");

interface CanvasInterface {
	canvas: HTMLCanvasElement | null | undefined,
	c : CanvasRenderingContext2D | null | undefined,
	ball: Ball,
	player1: Player,
	player2 : Player,
	keys_1 : Keys,
	keys_2: Keys
}

var start = 0;

function initGame(oldjson : CanvasInterface) {
	let json: CanvasInterface;
	if (start === 0)
	{
		let canvas = document.querySelector('canvas');
		let c = canvas?.getContext('2d');

		console.log(canvas);
		const ball = new Ball(canvas!);
		const player1 = new Player(0, canvas!.width, canvas!.height);
		const player2 = new Player(canvas!.width - (canvas!.width / 50), canvas!.width, canvas!.height);
		const keys_1 = new Keys();
		const keys_2 = new Keys();
		json = {
			"canvas": canvas,
			"c": c,
			"ball": ball,
			"player1": player1,
			"player2": player2,
			"keys_1": keys_1,
			"keys_2": keys_2
		};
		start = 1;
	}
	else {
		json = oldjson;
	}
	return json;
}

let json : CanvasInterface

function animate() {
	console.log("animate");
	json = initGame(json);
	console.log("init done");
	requestAnimationFrame(animate)
	if (json?.c && json?.canvas)
	{
		console.log("canvas");
		json.c.clearRect(0, 0, json.canvas.width, json.canvas.height);
		drawPlayers(json.canvas, json.c, json.keys_1, json.player1, json.keys_2, json.player2);
		json.ball.update(json.c, json.canvas, json.player1, json.player2);
	}
}

function launch(Start: any, Ready: any) {
	Start(false);
	socket.emit("joinGame");
	socket.on("gameStatus", (data: any) => {
		console.log("Status of the game room" , data);
		Ready(data);
		if (data == true) {
			animate();
		}
	})
}

function leave(Start: any) {
	Start(true);
}

function Game() {

	const [start, setStart] = useState(true);
	const [ready, setReady] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [canvasWidth, setCanvasWidth] = useState(0);
	const [canvasHeight, setCanvasHeight] = useState(0);

	const canvaRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setWindowWidth(window.innerWidth);
		});
	}, []);

	useEffect(() => {
		setCanvasWidth(windowWidth * 0.7);
		setCanvasHeight(windowHeight * 0.7);
	

		//Ball.update(canvaRef.current);
	}, [windowWidth]);

	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			{start ? (
        		<button onClick={() => launch(setStart, setReady) }>Start Game</button>
      		) : (
        		<button onClick={() => leave(setStart)}>Stop Game</button>
      		)}
			<p></p>
			{!start && ready ? (
				<canvas  ref={canvaRef} height={canvasHeight} width={canvasWidth} id="canvas"></canvas>
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

window.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "ArrowDown":
			json.keys_1.down = true;
			json.keys_2.down = true;
			if (json.c && json.canvas)
				{json.player1.update(json.c, json.keys_1, json.canvas);
				json.player2.update(json.c, json.keys_2, json.canvas);}
			break ;
		case "ArrowUp":
			json.keys_1.up = true;
			json.keys_2.up = true;
			if (json.c && json.canvas)
				{json.player1.update(json.c, json.keys_1, json.canvas);
				json.player2.update(json.c, json.keys_2, json.canvas);}
			break ;
		default:
			return ;
		}
		event.preventDefault();
	}, true);

export default Game;