import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import './game.scss';

import Player, { setInitialPlayerLeftState, setInitialPlayerRightState } from './interfaces/player.interface';
import Position from './interfaces/position.interface';
import { setInitialBallState } from './interfaces/ball.interface';
import GameStatus, { initialGameStatus } from './interfaces/gameStatus.interface';
import Gameplay, { setInitialGameplayState } from './interfaces/gameplay.interface';
import GameCanvas, { setInitialGameCanvasState } from './interfaces/gameCanvas.interface';
import UserData from 'features/user/interfaces/user.interface';
import UpdateBallDto from '../../hooks/interfaces/UpdateBall.dto';
import SetUserDto from "./interfaces/SetUser.dto";

import drawPlayer from './services/player.service';
import drawBall from './services/ball.service';
import { getNewBallPos } from './services/play.service';

import { Store } from '../../app/store';
import { mainSocketContext } from '../../App';
import { useGameListeners } from '../../hooks/useGame.hook';
import { UserStatusEnum } from './enums/userStatus.enum';


function Game() {

	/** Global Data */
	const mainSocket = useContext(mainSocketContext);
	const canvaRef = useRef<HTMLCanvasElement>(null);

	const store: Store = useSelector((store: Store) => store);
	const userData: UserData = store.user;

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

	/** Request a new game **/
	function launchPlaying() {
		setGameplay({
			...gameplay,
			ball: setInitialBallState(gameCanvas.width, gameCanvas.height),
			playerLeft: setInitialPlayerLeftState(gameCanvas.width, gameCanvas.height),
			playerRight: setInitialPlayerRightState(gameCanvas.width, gameCanvas.height),
		})
		setGameStatus({ ...gameStatus, start: false, win: "", watch: false });
		let userInfo: SetUserDto = {
			id: userData.id,
			login: userData.login,
		}
		mainSocket?.emit("joinGame", userInfo);
	}

	/**  start watching game of user **/
	//send ID of player you wsnt to watch
	function startWatching(user: SetUserDto) {
		setGameStatus({ ...gameStatus, side: UserStatusEnum.WATCHER, start: false, win: "", watch: true, ready: true })
		mainSocket?.emit("joingGameAsWatcher", user);
	}

	/**  stop watching game **/
	function stopWatching() {
		setGameStatus({ ...gameStatus, side: UserStatusEnum.UNASSIGNED, start: true, win: "", watch: false, ready: false })
		mainSocket?.emit("stopWatching");
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
			{gameStatus.start && (
				<button id="button-game" onClick={() => launchPlaying()}>Start Game</button>
			)}
			{!gameStatus.start && !gameStatus.watch && (
				<button id="button-game" onClick={() => mainSocket?.leaveGame([gameplay.playerLeft.score, gameplay.playerRight.score])}>Stop Game</button>
			)}
			{!gameStatus.start && gameStatus.watch && (
				<button id="button-game" onClick={() => stopWatching()}>Stop Watching</button>
			)}
			{!gameStatus.start && gameStatus.ready && (
				<div id="game_area">
					<h1>{gameplay.playerLeft.login} {gameplay.playerLeft.score} : {gameplay.playerRight.score} {gameplay.playerRight.login} </h1>
					<canvas ref={canvaRef} height={gameCanvas.height} width={gameCanvas.width} id="canvas"></canvas>
				</div>
			)}
			{!gameStatus.start && !gameStatus.ready && (
				<p>Waiting for another player...</p>
			)}
			{(gameStatus.start && !gameStatus.watch && gameStatus.win != "") ? (<h2>{gameStatus.win}</h2>) : (<p></p>)}
		</div>
	);
}

export default Game;


// ADD INIT GAME FOR EVERY CLICK ON START
