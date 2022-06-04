import Player from './interfaces/player.interface';
import drawPlayer from './services/player.service';
import Ball from './interfaces/ball.interface';
import drawBall from './services/ball.service';
import FullGame from './interfaces/game.interface';
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import './game.scss';
import { createLanguageServiceSourceFile } from 'typescript';

const socket: Socket = io("ws://localhost:3001", { transports: ["websocket"] });

function Game() {
	const canvaRef = useRef<HTMLCanvasElement>(null);
	const [start, setStart] = useState(true);
	const [ready, setReady] = useState(false);
	const [win, setWin] = useState("");
	const [windowWidth, setWindowWidth] = useState(600);
	const [windowHeight, setWindowHeight] = useState(400);
	const [canvasContext, setContext] = useState(canvaRef.current?.getContext('2d'));
	const [arrowUp, setArrowUp] = useState(false);
	const [side, setSide] = useState(0);
	const [arrowDown, setArrowDown] = useState(false);
	const [ball, setBall] = useState<Ball>({
		velocity: {
			x: 3,
			y: 1,
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
			y: 5,
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
			y: 5,
		}
	});
	const gameRef: FullGame = {
		width: windowWidth,
		height: windowHeight,
		ball: ball,
		context: canvasContext,
		playerleft: playerLeft,
		playerright: playerRight,
	}
	const [canvasWidth, setCanvasWidth] = useState(gameRef.width);
	const [canvasHeight, setCanvasHeight] = useState(gameRef.height);

	socket.on("gameStop", (stopclient: string) => {
		setStart(true);
		setSide(0);
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
				if (side === 0) {
					socket.emit("animateGame", ball.position.x, ball.position.y);
				}
			}
			else {
				setSide(1);
			}
		})
	}

	function handleKeyPressed(event: KeyboardEvent) {
		if (event.key === "ArrowDown") {
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

	socket.on("updateBall", (data: any) => {
		setBall({
			...ball,
			position: {
				x: data[0],
				y: data[1],
			},
		})
	}) 

	socket.on("updateLeftPlayer", (value: number) => {
		console.log("Update Player Left");
		setPlayerLeft({
			...playerLeft,
			position: {
				x: playerLeft.position.x,
				y: value,
			}
		})
	})

	socket.on("updateRightPlayer", (value: number) => {
		console.log("Update Player Right");
		setPlayerRight({
			...playerRight,
			position: {
				x: playerRight.position.x,
				y: value,
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
		if (side === 1) {
			let newPosX: number;
			let newPosY: number;
			if (ball.position.x + ball.velocity.x < 0 || ball.position.x + ball.velocity.x > gameRef.width) {
				ball.velocity.x = - ball.velocity.x;
			}
			if (ball.position.y + ball.velocity.y < 0 || ball.position.y + ball.velocity.y > gameRef.height) {
				ball.velocity.y = - ball.velocity.y;
			}
			newPosX = ball.position.x + ball.velocity.x;
			newPosY = ball.position.y + ball.velocity.y;
			socket.emit("animateGame", newPosX, newPosY);
		}
	}, [ball]);

	useEffect(() => {
		requestAnimationFrame(animate);
	}, [playerLeft]);

	useEffect(() => {
		requestAnimationFrame(animate);
	}, [playerRight]);

	useEffect(() => {
		if (arrowDown) {
			console.log("Arrow Down");
			let player: Player;
			let newPos: number;
			if (side === 1)
				player = playerLeft;
			else
				player = playerRight;
			newPos = player.position.y + player.velocity.y;
			if (player.position.y + player.velocity.y + player.height > gameRef.height) {
				newPos = gameRef.height - player.height;
			}
			socket.emit("movePlayer", newPos);
		}
	});

	useEffect(() => {
		if (arrowUp) {
			console.log("Arrow Up");
			let player: Player;
			let newPos: number;
			if (side === 1)
				player = playerLeft;
			else
				player = playerRight;
			newPos = player.position.y - player.velocity.y;
			if (player.position.y - player.velocity.y < 0) {
				newPos = 0;
			}
			socket.emit("movePlayer", newPos);
		}
	});

	function animate() {
		gameRef.context = canvaRef.current?.getContext('2d');
		gameRef.context?.clearRect(0, 0, gameRef.width, gameRef.height);
		//drawBall(gameRef, ball);
		drawPlayer(gameRef, playerLeft);
		drawPlayer(gameRef, playerRight);
	}

	return (
		<div className="main">
			<h2>Welcome to the Pong Game</h2>
			{start ? (
				<button id="button-game" onClick={() => launch()}>Start Game</button>
			) : (
				<button id="button-game" onClick={() => leave()}>Stop Game</button>
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


// ADD INIT GAME FOR EVERY CLICK ON START
