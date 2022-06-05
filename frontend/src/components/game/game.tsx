import Player, { setInitialPlayerLeftState, setInitialPlayerRightState } from './interfaces/player.interface';
import { resetPlayerLeftPosition, resetPlayerRightPosition } from './interfaces/player.interface';
import Position from './interfaces/position.interface';
import drawPlayer from './services/player.service';
import { setInitialBallState } from './interfaces/ball.interface';
import drawBall from './services/ball.service';
import { getNewBallPos } from './services/game.service';
import { useContext, useEffect, useRef, useState } from "react";
import './game.scss';
import { socketContext } from '../../App';
import { useGameListeners } from '../../hooks/useGame.hook';
import UpdateBallDto from '../../hooks/interfaces/UpdateBall.dto';
import GameStatus, { initialGameStatus } from './interfaces/gameStatus.interface';
import { UserStatusEnum } from './enums/userStatus.enum';
import Gameplay, { setInitialGameplayState } from './interfaces/gameplay.interface';
import GameCanvas, { setInitialGameCanvasState } from './interfaces/gameCanvas.interface';

function Game() {

	/** Global Data */
	const mainSocket = useContext(socketContext);
	const canvaRef = useRef<HTMLCanvasElement>(null);

	/** Variables */
	const [gameCanvas, setGameCanvas] = useState<GameCanvas>(setInitialGameCanvasState(canvaRef));
	const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);
	const [gameplay, setGameplay] = useState<Gameplay>(setInitialGameplayState(gameCanvas.width, gameCanvas.height));

	/** Set game listeners (keyboard events & socket events) */
	useGameListeners({
		gameplay,
		setGameplay,
		gameStatus,
		setGameStatus,
		gameCanvas,
		setGameCanvas,
	});

	/** Start the game */
	function launch() {
		setGameplay({
			...gameplay,
			ball: setInitialBallState(gameCanvas.width, gameCanvas.height),
			playerLeft: setInitialPlayerLeftState(gameCanvas.width, gameCanvas.height),
			playerRight: setInitialPlayerRightState(gameCanvas.width, gameCanvas.height),
		})
		setGameStatus({ ...gameStatus, start: false, win: "" });
		mainSocket?.emit("joinGame");
	}

	/** Update ball object */
	useEffect(() => {
		requestAnimationFrame(animate);
		if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
			let newPos: Position;
			newPos = getNewBallPos(gameplay, gameStatus, gameCanvas.height, gameCanvas.width);
			if (newPos.y < 0 || newPos.x < 0) {
				mainSocket?.emit("resetGame", { posX: gameplay.playerLeft.score, posY: gameplay.playerRight.score } as UpdateBallDto);
			}
			else {
				mainSocket?.emit("animateGame", { posX: newPos.x, posY: newPos.y } as UpdateBallDto);
			}
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
		mainSocket?.emit("updateScoreLeft", gameplay.playerLeft.score);
	}, [gameplay.playerLeft.score])

	useEffect(() => {
		mainSocket?.emit("updateScoreRight", gameplay.playerLeft.score);
	}, [gameplay.playerRight.score])

	useEffect(() => {
		if (gameplay.arrowDown) {
			let player: Player;
			let newPos: number;

			if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
				player = gameplay.playerLeft;
			} else {
				player = gameplay.playerRight;
			}
			newPos = player.position.y + player.velocity.y;
			if (player.position.y + player.velocity.y + player.height > gameCanvas.height) {
				newPos = gameCanvas.height - player.height;
			}
			mainSocket?.emit("movePlayer", newPos);
		}
	});

	useEffect(() => {
		if (gameplay.arrowUp) {
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
		gameCanvas.context = canvaRef.current?.getContext('2d');
		gameCanvas.context?.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		drawBall(gameCanvas, gameplay.ball);
		drawPlayer(gameCanvas, gameplay.playerLeft);
		drawPlayer(gameCanvas, gameplay.playerRight);
	}

	return (
		<div className="main">
			<h2>Welcome to the Pong Game</h2>
			{gameStatus.start ? (
				<>
					<button id="button-game" onClick={() => launch()}>Start Game</button>
					<p></p>
					<button id="button-game" onClick={() => launch()}>Watch Game</button>
				</>
			) : (
				<button id="button-game" onClick={() => mainSocket?.leaveGame()}>Stop Game</button>
			)}
			<p></p>
			{!gameStatus.start && gameStatus.ready && (
				<div id="game_area">
					<h1>{gameplay.playerLeft.score} : {gameplay.playerRight.score}</h1>
					<canvas ref={canvaRef} height={gameCanvas.height} width={gameCanvas.width} id="canvas"></canvas>
				</div>
			)}
			{!gameStatus.start && !gameStatus.ready && (
				<p>Waiting for another player...</p>
			)}
			{(gameStatus.start && gameStatus.win != "") ? (<h2>{gameStatus.win}</h2>) : (<p></p>)}
		</div>
	);
}

export default Game;


// ADD INIT GAME FOR EVERY CLICK ON START
