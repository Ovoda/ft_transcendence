import { MouseEvent, useCallback, useContext } from "react";
import ClientSocket from "services/websocket.service";
import { mainSocketContext } from "src";
import { drawGame } from "./drawGame";
import { BallHitEnum } from "./enums/ballHit.enum";
import NewRoundDto from "./interfaces/newRound.dto";
import SynchronizeBallHitDto from "./interfaces/synchronizeGame.dto";
import SynchronizePlayerDto from "./interfaces/synchronizePlayer.dto";
import { udpatePlayers, updateBall } from "./updateGame";
import './game.scss';
import SynchronizeGameDto from "./interfaces/synchronizeGame.dto";
import { GameStatusEnum } from "./enums/gameStatus.enum";
import StopGameDto from "./interfaces/stopGame.dto";
import setGame from "./setGame";
import Button from "assets/Button/Button";
import GameStartDto from "./interfaces/gameStart.dto";
import { hideById, showById } from "./utils";
import close from 'images/close.png';
import { useDispatch } from "react-redux";
import { showChat } from "features/chat/chat.slice";
import GameWatchDto from "./interfaces/gameWatch.dto";
import { setGameIsPrivate, setRequestedUser, setRequestingUser } from "features/game/game.slice";

let nbOfRound = 10;
let ballSpeed = 6;
let userLogins = ["", ""];

export default function Game() {

	/** Global data */
	const mainSocket: ClientSocket | null = useContext(mainSocketContext);
	const dispatch = useDispatch();


	/** DOM Element */
	let context: CanvasRenderingContext2D | null = null;
	const canvaRef = useCallback((node: any) => {
		if (node !== null) {
			context = node.getContext('2d');
		}
	}, []);

	let canvaWidth = Math.min(window.innerWidth * .5, 3000);
	let canvaHeight = canvaWidth * 2 / 3;

	window.addEventListener("resize", () => {
		const game_canva = document.getElementById("game_canva") as HTMLCanvasElement;
		game_canva.width = Math.min(window.innerWidth * .5, 3000);
		game_canva.height = game_canva.width * 2 / 3;
		canvaWidth = game_canva.width;
		canvaHeight = game_canva.height;
	})

	let global = setGame();

	/** Variables */
	document.addEventListener("keydown", (event: KeyboardEvent) => {

		if (global.isWatching) { return; }

		if (event.key === "ArrowDown" && global.isCurrentRight) {
			global.players[1].goDown = true;
			global.players[1].goUp = false;
		}
		if (event.key === "ArrowDown" && !global.isCurrentRight) {
			global.players[0].goDown = true;
			global.players[0].goUp = false;
		}

		if (event.key === "ArrowUp" && global.isCurrentRight) {
			global.players[1].goDown = false;
			global.players[1].goUp = true;
		}
		if (event.key === "ArrowUp" && !global.isCurrentRight) {
			global.players[0].goDown = false;
			global.players[0].goUp = true;
		}

		if (global.isCurrentRight) {
			mainSocket?.emit("updatePlayer", {
				newGoDown: global.players[1].goDown,
				newGoUp: global.players[1].goUp,
				updateRight: global.isCurrentRight,
				gameRoomId: global.currentGameRoomId
			} as SynchronizePlayerDto);
		} else {
			mainSocket?.emit("updatePlayer", {
				newGoDown: global.players[0].goDown,
				newGoUp: global.players[0].goUp,
				updateRight: global.isCurrentRight,
				gameRoomId: global.currentGameRoomId
			} as SynchronizePlayerDto);
		}
	});

	document.addEventListener("keyup", (event: KeyboardEvent) => {
		if (global.isWatching) { return; }

		if (global.isCurrentRight) {
			global.players[1].goDown = false;
			global.players[1].goDown = false;
		} else {
			global.players[0].goDown = false;
			global.players[0].goDown = false;
		}

		mainSocket?.emit("updatePlayer", {
			newGoDown: false,
			newGoUp: false,
			updateRight: global.isCurrentRight,
			gameRoomId: global.currentGameRoomId
		} as SynchronizePlayerDto);
	});

	async function gameLoop() {
		if (global.gameStatus !== GameStatusEnum.ON as GameStatusEnum) return;
		if (!context) return;
		if ((global.scores[0] >= nbOfRound || global.scores[1] >= nbOfRound) && !global.isWatching) {
			stopGame();
			return;
		};

		udpatePlayers(global.players);

		switch (updateBall(global.ball, global.players, ballSpeed)) {
			case BallHitEnum.OUT_LEFT:
				if (global.isCurrentRight) {
					global.scores[1]++;
					mainSocket?.emit("newRound", { scores: global.scores, gameRoomId: global.currentGameRoomId } as NewRoundDto);
				}
				break;

			case BallHitEnum.OUT_RIGHT:
				if (global.isCurrentRight) {
					global.scores[0]++;
					mainSocket?.emit("newRound", { scores: global.scores, gameRoomId: global.currentGameRoomId } as NewRoundDto);
				}
				break;

			default:
				break;
		}
		if (!global.isWatching) {
			mainSocket?.emit("synchronizeGame", {
				x: global.ball.x,
				y: global.ball.y,
				vx: global.ball.vx,
				vy: global.ball.vy,
				isRight: global.isCurrentRight,
				gameRoomId: global.currentGameRoomId,
				px: global.isCurrentRight ? global.players[1].x : global.players[0].x,
				py: global.isCurrentRight ? global.players[1].y : global.players[0].y,
			} as SynchronizeGameDto);
		}

		drawGame(context, global.ball, global.players, global.scores, canvaHeight, canvaWidth, userLogins);

		setTimeout(() => {
			requestAnimationFrame(gameLoop);
		}, 10);
	}

	function stopWaiting(event: MouseEvent<HTMLButtonElement>) {
		const target = event?.target as HTMLButtonElement;
		target.style.display = "none";

		showById("start_game_button");
		hideById("stop_waiting_game_button");
		hideById("pending_game_text");
		dispatch(showChat(true));

		mainSocket?.emit("stopWaitingGame");
	}

	function pauseGame(event: MouseEvent<HTMLButtonElement>) {
		const target = event.target as HTMLButtonElement;
		target.style.display = "none";
		showById("resume_game_button");
		mainSocket?.emit("pauseGame", global.currentGameRoomId);
	}

	function resumeGame(event: MouseEvent<HTMLButtonElement>) {
		const target = event.target as HTMLButtonElement;
		target.style.display = "none";
		showById("pause_game_button");
		mainSocket?.emit("resumeGame", global.currentGameRoomId);
	}

	function stopWatch(event: MouseEvent<HTMLButtonElement>) {
		mainSocket?.emit("stopWatching");
		userLogins = ["", ""];
		global.isWatching = false;
		global.gameStatus = GameStatusEnum.OFF as GameStatusEnum;
		hideById("game_canva");
		hideById("stop_watch_game_button");
		showById("start_game_button");
		hideById("pause_game_button");
		hideById("resume_game_button");
		hideById("stop_watch_game_button");
		dispatch(showChat(true));
	}

	function stopGame() {
		mainSocket?.emit("stopGame", { gameRoomId: global.currentGameRoomId, scores: global.scores } as StopGameDto);
	}

	const gameStartCallback = ({ isRight, gameRoomId, hard, long, spin, logins }: GameStartDto) => {
		/** Start */
		global.scores = [0, 0];
		global.isWatching = false;
		if (spin) {
			const canva = document.getElementById("game_canva") as HTMLCanvasElement;
			canva.classList.add("game_canva_spin");
		}

		ballSpeed = 6;
		nbOfRound = 10;
		userLogins = logins;
		global.isCurrentRight = isRight;
		global.currentGameRoomId = gameRoomId;
		if (hard) {
			ballSpeed = 15;
		}
		if (long) {
			nbOfRound = 20;
		}
		global.ball.vx = ballSpeed;
		global.ball.vy = ballSpeed;
		global.gameStatus = GameStatusEnum.ON;
		hideById("pending_game_text");
		hideById("start_game_button");
		hideById("stop_waiting_game_button");
		hideById("pending_game_button");
		showById("game_canva");
		showById("pause_game_button");
		dispatch(showChat(false));
		gameLoop();
	}

	const gameBallSyncCallback = (data: SynchronizeBallHitDto) => {

		global.ball.x = data.x;
		global.ball.y = data.y;
		global.ball.vx = data.vx;
		global.ball.vy = data.vy;
		if (data.isRight) {
			global.players[1].x = data.px;
			global.players[1].y = data.py;
		} else {
			global.players[0].x = data.px;
			global.players[0].y = data.py;
		}
	}

	const updatePlayerCallback = ({ newGoDown, newGoUp, updateRight }: { newGoDown: boolean, newGoUp: boolean, updateRight: boolean }) => {
		if (updateRight) {
			global.players[1].goDown = newGoDown;
			global.players[1].goUp = newGoUp;
		} else {
			global.players[0].goDown = newGoDown;
			global.players[0].goUp = newGoUp;
		}
	}

	const newRoundCallback = (data: NewRoundDto) => {
		global.scores = data.scores;
	}

	const pauseGameCallback = () => {
		if (global.gameStatus === GameStatusEnum.PAUSE) return;
		if (!global.isWatching) {
			showById("resume_game_button");
		}
		hideById("pause_game_button");
		global.gameStatus = GameStatusEnum.PAUSE;
	}

	const resumeGameCallback = () => {
		if (global.gameStatus === GameStatusEnum.ON) return;
		if (!global.isWatching) {
			showById("pause_game_button");
		}
		hideById("resume_game_button");
		global.gameStatus = GameStatusEnum.ON;
		gameLoop();
	}

	const stopGameCallback = () => {
		global.gameStatus = GameStatusEnum.OFF;
		let scoreText = "Victory !";
		if (global.isCurrentRight && global.scores[1] > global.scores[0]) {
			scoreText = "Victory !";
		} else if (global.isCurrentRight && global.scores[0] > global.scores[1]) {
			scoreText = "Defeat !";
		}

		if (!global.isCurrentRight && global.scores[0] > global.scores[1]) {
			scoreText = "Victory !";
		} else if (!global.isCurrentRight && global.scores[1] > global.scores[0]) {
			scoreText = "Defeat !";
		}

		hideById("game_canva");
		hideById("pause_game_button");
		showById("start_game_button");
		hideById("stop_watch_game_button");
		if (!global.isWatching) {
			showById("endgame_container", "flex");
		}
		dispatch(showChat(true));
		dispatch(setGameIsPrivate(false));
		dispatch(setRequestedUser(""));
		dispatch(setRequestingUser(null));

		const uiResult = document.getElementById("final_game_result") as HTMLTitleElement;
		uiResult.innerText = scoreText;

		const uiScore = document.getElementById("final_scores") as HTMLTitleElement;
		if (scoreText === "Victory !")
			uiScore.innerText = `${global.scores[0]} - ${global.scores[1]}`;
		else
			uiScore.innerText = `${global.scores[1]} - ${global.scores[0]}`;
	}


	const gameWatchCallback = (data: GameWatchDto) => {
		userLogins = [data.left, data.right];
		global.isWatching = true;
		global.gameStatus = GameStatusEnum.ON as GameStatusEnum;
		showById("game_canva");
		showById("stop_watch_game_button");
		hideById("start_game_button");
		hideById("pause_game_button");
		hideById("resume_game_button");
		gameLoop();
	}

	mainSocket?.on("gameStart", gameStartCallback);
	mainSocket?.on("synchronizeGame", gameBallSyncCallback);
	mainSocket?.on("updatePlayer", updatePlayerCallback);
	mainSocket?.on("pauseGame", pauseGameCallback);
	mainSocket?.on("resumeGame", resumeGameCallback);
	mainSocket?.on("newRound", newRoundCallback);
	mainSocket?.on("stopGame", stopGameCallback);
	mainSocket?.on("gameWatch", gameWatchCallback);


	function resetUi() {
		hideById("endgame_container");
		hideById("resume_game");
		hideById("pause_game");
		showById("start_game_button");
	}

	return (
		<>
			<canvas
				id="game_canva"
				style={{ display: "none" }}
				ref={canvaRef}
				height={canvaHeight}
				width={canvaWidth}>
			</canvas>
			<Button id="pause_game_button" style={{ display: "none" }} onClick={pauseGame}>Pause game</Button>
			<Button id="resume_game_button" style={{ display: "none" }} onClick={resumeGame}>Resume game</Button>
			<Button id="stop_watch_game_button" style={{ display: "none" }} onClick={stopWatch}>Stop watching</Button>
			<Button id="stop_waiting_game_button" style={{ display: "none" }} onClick={stopWaiting}>Stop waiting</Button>

			<div id="endgame_container" style={{ display: "none" }}>
				<div id="endgame">
					<h2 id="final_game_result"></h2>
					<p id="final_scores"></p>
					<img id="close_button_img" onClick={resetUi} src={close} alt="Close modal icon" />
				</div>
			</div>

		</>
	)
}