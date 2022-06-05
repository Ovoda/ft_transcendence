import Player, { setInitialPlayerLeftState, setInitialPlayerRightState } from './interfaces/player.interface';
import drawPlayer from './services/player.service';
import { setInitialBallState } from './interfaces/ball.interface';
import drawBall from './services/ball.service';
import FullGame from './interfaces/game.interface';
import { useContext, useEffect, useRef, useState } from "react";
import './game.scss';
import { mainSocketContext } from '../../App';
import { useGameListeners } from '../../hooks/useGame.hook';
import UpdateBallDto from '../../hooks/interfaces/UpdateBall.dto';
import GameStatus, { initialGameStatus } from './interfaces/gameStatus.interface';
import { UserStatusEnum } from './enums/userStatus.enum';
import Gameplay, { setInitialGameplayState } from './interfaces/gameplay.interface';


function Game() {

	/** Global Data */
	const mainSocket = useContext(mainSocketContext);

	/** Variables */
	const canvaRef = useRef<HTMLCanvasElement>(null);
	const [canvasContext, setContext] = useState(canvaRef.current?.getContext('2d'));
	const [windowWidth, setWindowWidth] = useState(600);
	const [windowHeight, setWindowHeight] = useState(400);

	const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);
	const [gameplay, setGameplay] = useState<Gameplay>(setInitialGameplayState(windowWidth, windowHeight));

	const gameRef: FullGame = {
		width: windowWidth,
		height: windowHeight,
		ball: gameplay.ball,
		context: canvasContext,
		playerleft: gameplay.playerLeft,
		playerright: gameplay.playerRight,
	}
	const [canvasWidth, setCanvasWidth] = useState(gameRef.width);
	const [canvasHeight, setCanvasHeight] = useState(gameRef.height);

	/** Set game listeners (keyboard events & socket events) */
	useGameListeners({
		gameplay,
		setGameplay,
		gameStatus,
		setGameStatus
	});

	/** Start the game */
	function launch() {
		setGameplay({
			...gameplay,
			ball: setInitialBallState(windowWidth, windowHeight),
			playerLeft: setInitialPlayerLeftState(windowWidth, windowHeight),
			playerRight: setInitialPlayerRightState(windowWidth, windowHeight),
		})
		setGameStatus({ ...gameStatus, start: false, win: "" });
		mainSocket?.emit("joinGame");
	}

	/** Update ball object */
	useEffect(() => {
		requestAnimationFrame(animate);
		if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
			let newPosX: number;
			let newPosY: number;
			if (gameplay.ball.position.x + gameplay.ball.velocity.x < 0 || gameplay.ball.position.x + gameplay.ball.velocity.x > gameRef.width) {
				gameplay.ball.velocity.x = - gameplay.ball.velocity.x;
			}
			if (gameplay.ball.position.y + gameplay.ball.velocity.y < 0 || gameplay.ball.position.y + gameplay.ball.velocity.y > gameRef.height) {
				gameplay.ball.velocity.y = - gameplay.ball.velocity.y;
			}
			newPosX = gameplay.ball.position.x + gameplay.ball.velocity.x;
			newPosY = gameplay.ball.position.y + gameplay.ball.velocity.y;
			mainSocket?.emit("animateGame", { posX: newPosX, posY: newPosY } as UpdateBallDto);
		}
	}, [gameplay.ball]);


	/** Update players */
	useEffect(() => {
		requestAnimationFrame(animate);
	}, [gameplay.playerLeft]);

	useEffect(() => {
		requestAnimationFrame(animate);
	}, [gameplay.playerRight]);

	useEffect(() => {
		if (gameplay.arrowDown) {
			console.log("Arrow Down");
			let player: Player;
			let newPos: number;

			if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
				player = gameplay.playerLeft;
			} else {
				player = gameplay.playerRight;
			}

			newPos = player.position.y + player.velocity.y;
			if (player.position.y + player.velocity.y + player.height > gameRef.height) {
				newPos = gameRef.height - player.height;
			}
			mainSocket?.emit("movePlayer", newPos);
		}
	});

	useEffect(() => {
		if (gameplay.arrowUp) {
			console.log("Arrow Up");
			let player: Player;
			let newPos: number;
			if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
				player = gameplay.playerLeft;
			} else {
				player = gameplay.playerRight;
			}
			newPos = player.position.y - player.velocity.y;
			if (player.position.y - player.velocity.y < 0) {
				newPos = 0;
			}
			mainSocket?.emit("movePlayer", newPos);
		}
	});

	/** Render game */
	function animate() {
		gameRef.context = canvaRef.current?.getContext('2d');
		gameRef.context?.clearRect(0, 0, gameRef.width, gameRef.height);
		drawBall(gameRef, gameplay.ball);
		drawPlayer(gameRef, gameplay.playerLeft);
		drawPlayer(gameRef, gameplay.playerRight);
	}

	return (
		<div className="main">
			<h2>Welcome to the Pong Game</h2>
			{gameStatus.start ? (
				<button id="button-game" onClick={() => launch()}>Start Game</button>
			) : (
				<button id="button-game" onClick={() => mainSocket?.leaveGame()}>Stop Game</button>
			)}
			<p></p>
			{!gameStatus.start && gameStatus.ready && (
				<canvas ref={canvaRef} height={canvasHeight} width={canvasWidth} id="canvas"></canvas>
			)}
			{!gameStatus.start && !gameStatus.ready && (
				<p>Waiting for another player...</p>
			)}
			{(gameStatus.start && gameStatus.win != "") ? (<p>{gameStatus.win}</p>) : (<p></p>)}
		</div>
	);
}

export default Game;


// ADD INIT GAME FOR EVERY CLICK ON START
