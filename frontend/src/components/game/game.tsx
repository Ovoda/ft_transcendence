import Player from './interfaces/player.interface';
import drawPlayer from './services/player.service';
import Ball from './interfaces/ball.interface';
import drawBall from './services/ball.service';
import FullGame from './interfaces/game.interface';
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import './game.scss';

const socket: Socket = io("ws://localhost:3001");

function Game() {
	const canvaRef = useRef<HTMLCanvasElement>(null);
	const [start, setStart] = useState(true);
	const [ready, setReady] = useState(false);
	const [win, setWin] = useState("");
	const [windowWidth, setWindowWidth] = useState(600);
	const [windowHeight, setWindowHeight] = useState(400);
	const [canvasContext, setContext] = useState(canvaRef.current?.getContext('2d'));
	const [arrowUp, setArrowUp] = useState(false);
	const [arrowDown, setArrowDown] = useState(false);
	const [ball, setBall] = useState<Ball>({
		velocity: {
			x: 3,
			y: 0,
		},
		position: {
			x: windowWidth / 2,
			y: windowHeight / 2,
		},
		radius: windowWidth / 50,

	})
	const [playerLeft, setPlayerLeft] = useState<Player>({
		score: 0,
		side: 'left',
		width: windowWidth / 45,
		height: windowHeight / 3,
		position: {
			x: 0,
			y: (windowHeight / 2) - ((windowHeight / 3) /2),
		},
		velocity: {
			x: 0,
			y: 3,
		}
	});
	const [playerRight, setPlayerRight] = useState<Player>({
		score: 0,
		side: 'right',
		width: windowWidth / 45,
		height: windowHeight / 3,
		position: {
			x: windowWidth - (windowWidth / 45),
			y: (windowHeight / 2) - ((windowHeight / 3) /2),
		},
		velocity: {
			x: 0,
			y: 3,
		}
	});
	const gameRef: FullGame = {
		width: windowWidth,
		height: windowHeight,
		ball: ball,
		context: canvasContext,
		playerleft: playerLeft,
		playerright: playerLeft,
	}
	const [canvasWidth, setCanvasWidth] = useState(gameRef.width);
	const [canvasHeight, setCanvasHeight] = useState(gameRef.height);


	socket.on("gameStop", (stopclient: string) => {
		console.log("Stopping the game");
		setStart(true);
		if (stopclient === socket.id) {
			setWin("You Lost!");
		}
		else {
			setWin("You Won!");
		}
		socket.emit("deleteRoom");
	})

	function leave() {
		socket.emit("leaveGame");
	}

	function launch() {
		setStart(false);
		setWin("");
		socket.emit("joinGame");
		socket.on("gameStatus", (data: any) => {
			setReady(data);
			if (data === true) {
				animate();
			}
		})
	}

	function handleKeyPressed(event: KeyboardEvent) {
		if (event.key === "ArrowDown") {
			console.log("Arrow Down");
			setArrowDown(true);
		}
		else if (event.key === "ArrowUp") {
			setArrowUp(true);
		}
	}

	function handleKeyUnpressed(event: KeyboardEvent) {
		if (event.key === "ArrowDown") {
			setArrowDown(false);
		}
		else if (event.key === "ArrowUp") {
			setArrowUp(false);
		}
	}

	socket.on("updateLeftPlayer", (value: number) => {
		setPlayerLeft({
			...playerLeft,
			position: {
				x: playerLeft.position.x,
				y: playerLeft.position.y + value,
			}
		})
	})

	socket.on("updateRightPlayer", (value: number) => {
		setPlayerRight({
			...playerRight,
			position: {
				x: playerRight.position.x,
				y: playerRight.position.y + value,
			}
		})
	})

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPressed);
		window.addEventListener("keyup", handleKeyUnpressed);
		return () => {
			window.removeEventListener("keydown", handleKeyPressed);
			window.removeEventListener("keyup", handleKeyUnpressed);
		};
	});

	useEffect(() => {
		requestAnimationFrame(animate);
	}, [playerLeft]);
	useEffect(() => {
		requestAnimationFrame(animate);
	}, [playerRight]);

	useEffect(() => {
		if (arrowDown) {
			socket.emit("arrowDown");
		}
	});

	useEffect(() => {
		if (arrowUp) {
			socket.emit("arrowUp");
		}
	});

	function animate() {
		gameRef.context = canvaRef.current?.getContext('2d');
		gameRef.context?.clearRect(0, 0, gameRef.width, gameRef.height);
		drawBall(gameRef, ball);
		drawPlayer(gameRef, playerLeft);
		drawPlayer(gameRef, playerRight);
	}

	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			{start ? (
				<button onClick={() => launch()}>Start Game</button>
			) : (
				<button onClick={() => leave()}>Stop Game</button>
			)}
			<p></p>
			{!start && ready ? (
				<canvas ref={canvaRef} height={canvasHeight} width={canvasWidth} id="canvas"></canvas>
			) : (
				<p></p>
			)}
			{!start && !ready ?(
				<p>Waiting for another player...</p>
			) : (
				<p></p>
			)}
			{start && win != "" ? (<p>{win}</p>):(<p></p>)}
		</div>
	);
}

export default Game;