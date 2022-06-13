import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import './GamePlay.scss';
import Player, { setInitialPlayerLeftState, setInitialPlayerRightState } from './interfaces/player.interface';
import Position from './interfaces/position.interface';
import { setInitialBallState } from './interfaces/ball.interface';
import GameStatus, { initialGameStatus } from './interfaces/gameStatus.interface';
import Gameplay, { setInitialGameplayState } from './interfaces/gameplay.interface';
import GameCanvas, { setInitialGameCanvasState } from './interfaces/gameCanvas.interface';
import { PlayStatusEnum } from "./enums/playStatus.enum";
import UserData from 'features/user/interfaces/user.interface';
import UpdateBallDto from '../../../hooks/interfaces/UpdateBall.dto';
import SetUserDto from "./interfaces/SetUser.dto";
import drawPlayer from './services/player.service';
import drawBall from './services/ball.service';
import { getNewBallPos } from './services/play.service';
import { Store } from '../../../app/store';
import { useGameListeners } from '../../../hooks/useGame.hook';
import { UserStatusEnum } from './enums/userStatus.enum';
import Button from "assets/Button/Button";
import { ResultStatusEnum } from "./enums/resultStatus.enum";
import SwitchButton from "assets/SwitchButton/SwitchButton";
import { mainSocketContext } from "src";
import SelectOptions from "../gameOptions/SelectOptions";
import { useDispatch } from "react-redux";
import { openGameOptions } from "features/uiState/uiState.slice";

const shortGameScoreToWin: number = 21;
const longGameScoreToWin: number = 42;
const defaultBackgroundColor: string = '#4285F4';
const defaultElementsColor: string = 'white';

function GamePlay() {

	///** Global Data */
	const mainSocket = useContext(mainSocketContext);
	const canvaRef = useRef<HTMLCanvasElement>(null);

	const store: Store = useSelector((store: Store) => store);
	const userData: UserData = store.user;

	/** Tools */
	const dispatch = useDispatch();

	///** Variables */
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

	/**  stop playing the game **/
	async function leaveGame(data: number[]) {
		mainSocket?.emit("leaveGame", data);
		return true;
	}

	/**  pausehe game **/
	async function pauseGame() {
		mainSocket?.emit("pauseGameRequest");
		return true;
	}

	/** Resume Game */
	async function resumeGame() {
		let ballPos: UpdateBallDto = {
			posX: gameplay.ball.position.x,
			posY: gameplay.ball.position.y,
		}
		mainSocket?.emit("resumeGameRequest", ballPos);
		return true;
	}

	/**  stop watching game **/
	async function stopWatching() {
		setGameStatus({ ...gameStatus, user: UserStatusEnum.UNASSIGNED, result: ResultStatusEnum.UNDEFINED, play: PlayStatusEnum.OFF })
		setGameplay(setInitialGameplayState(gameCanvas.width, gameCanvas.height));
		mainSocket?.emit("stopWatching");
		return true;
	}

	/** Update ball object */
	useEffect(() => {
		if (gameStatus.play === PlayStatusEnum.ON) {
			requestAnimationFrame(animate);
			if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
				let newPos: Position;
				newPos = getNewBallPos(gameplay, gameStatus, gameCanvas.height, gameCanvas.width);
				if (newPos.y < 0 || newPos.x < 0) {
					mainSocket?.emit("resetGame", { posX: gameplay.playerLeft.score, posY: gameplay.playerRight.score } as UpdateBallDto);
				}
				else {
					setTimeout(() => {
						mainSocket?.emit("animateGame", { posX: newPos.x, posY: newPos.y } as UpdateBallDto);
					}, 1);
				}
			}
		}
	}, [gameplay.ball]);

	/** Update players */
	useEffect(() => {
		if (gameStatus.play === PlayStatusEnum.ON && gameStatus.user !== UserStatusEnum.WATCHER) {
			requestAnimationFrame(animate);
		}
	}, [gameplay.playerLeft]);

	useEffect(() => {
		if (gameStatus.play === PlayStatusEnum.ON && gameStatus.user !== UserStatusEnum.WATCHER) {
			requestAnimationFrame(animate);
		}
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

			if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
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
			if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
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

	const [darkModeActivated, setDarkModeActivated] = useState<boolean>(false);

	useEffect(() => {
		if (darkModeActivated) {
			setGameCanvas({
				...gameCanvas,
				background_color: 'black',
				elements_color: 'white'
			})
		}
		else {
			setGameCanvas({
				...gameCanvas,
				background_color: defaultBackgroundColor,
				elements_color: defaultElementsColor,
			})
		}
		requestAnimationFrame(animate);
	}, [darkModeActivated]);

	/** Render game */
	function animate() {
		if (gameStatus.play !== PlayStatusEnum.OFF) {
			gameCanvas.context = canvaRef.current?.getContext('2d');
			gameCanvas.context?.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
			if (!gameCanvas.context) { return; }
			gameCanvas.context.fillStyle = gameCanvas.background_color;
			gameCanvas.context?.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
			drawBall(gameCanvas, gameplay.ball);
			drawPlayer(gameCanvas, gameplay.playerLeft);
			drawPlayer(gameCanvas, gameplay.playerRight);
		}
	}

	async function handleOptionsModal() {
		dispatch(openGameOptions());
		return false;
	}

	return (
		<div className="gameplay">
			<div className="game_buttons">
				{gameStatus.play === PlayStatusEnum.OFF && (
					<>
						<Button onClick={() => handleOptionsModal()}>Start a Game</Button>
						<SelectOptions setGameplay={setGameplay} gameplay={gameplay} gameCanvas={gameCanvas} />
					</>
				)}
				{gameStatus.play !== PlayStatusEnum.OFF && gameStatus.user !== UserStatusEnum.WATCHER && (
					<Button onClick={() => leaveGame([gameplay.playerLeft.score, gameplay.playerRight.score])}>Stop Game</Button>
				)}
				{gameStatus.play === PlayStatusEnum.ON && gameStatus.user !== UserStatusEnum.WATCHER && (
					<Button onClick={() => pauseGame()}>Pause Game</Button>
				)}

				{gameStatus.play === PlayStatusEnum.PENDING && (
					<p>Waiting for a match...</p>
				)}
				{gameStatus.play === PlayStatusEnum.PAUSE && gameStatus.user !== UserStatusEnum.WATCHER && (
					<Button onClick={() => resumeGame()}>Resume Game</Button>
				)}
				{gameStatus.user === UserStatusEnum.WATCHER && (
					<Button onClick={() => stopWatching()}>Stop Watching</Button>
				)}
			</div>
			{(gameStatus.play === PlayStatusEnum.ON || gameStatus.play === PlayStatusEnum.PAUSE) && (
				<>
					<div id="score_container">
						<h2 className="score_player1">{gameplay.playerLeft.login}  {gameplay.playerLeft.score}</h2>
						<h2 className="score">:</h2>
						<h2 className="score_player2">{gameplay.playerRight.score}   {gameplay.playerRight.login}</h2>
					</div>
					<canvas ref={canvaRef} height={gameCanvas.height} width={gameCanvas.width} id="canvas"></canvas>
					<ul id="dark_button">
						<p>Dark Mode</p>
						<SwitchButton value={darkModeActivated} setValue={setDarkModeActivated} />
					</ul>
				</>
			)}
		</div>
	);
}

export default GamePlay;