import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import UpdateBallDto from "./interfaces/UpdateBall.dto";
import { getNewBallPos, handleKeyPressed, handleKeyUnpressed } from "../components/game/gamePlay/services/play.service";
import GameStatus from "src/components/game/gamePlay/interfaces/gameStatus.interface";
import { UserStatusEnum } from "../components/game/gamePlay/enums/userStatus.enum";
import { PlayStatusEnum } from "../components/game/gamePlay/enums/playStatus.enum";
import { ResultStatusEnum } from "../components/game/gamePlay/enums/resultStatus.enum";
import Gameplay from "src/components/game/gamePlay/interfaces/gameplay.interface";
import { setInitalBallPosition, setInitialBallRadius, setInitialBallState, setRandomBallSpeed } from '../components/game/gamePlay/interfaces/ball.interface';
import GameCanvas from "src/components/game/gamePlay/interfaces/gameCanvas.interface";
import { Store } from '../app/store';
import { useDispatch, useSelector } from "react-redux";
import UserData from "features/user/interfaces/user.interface";
import { mainSocketContext } from "src";
import { setNotification } from "features/uiState/uiState.slice";
import { setBallSpeed } from "src/components/game/gamePlay/services/ball.service";

const shortGameScoreToWin: number = 21;
const longGameScoreToWin: number = 42;

interface Props {
	setGameplay: Dispatch<SetStateAction<Gameplay>>,
	gameplay: Gameplay,
	setGameStatus: Dispatch<SetStateAction<GameStatus>>;
	gameStatus: GameStatus;
	setGameCanvas: Dispatch<SetStateAction<GameCanvas>>,
	gameCanvas: GameCanvas;
	launchGame: any;
}

export function useGameListeners({ gameplay, setGameplay, gameStatus, setGameStatus, gameCanvas, setGameCanvas, launchGame }: Props) {

	/** Tools */
	const dispatch = useDispatch();

	/** Gloabal Data */
	const store: Store = useSelector((store: Store) => store);
	const userData: UserData = store.user;
	const mainSocket = useContext(mainSocketContext);

	useEffect(() => {
		if (!mainSocket) return;

		const gameStopCallback = (stopclient: string) => {
			const Result = stopclient === mainSocket.socket.id ? ResultStatusEnum.LOOSE : ResultStatusEnum.WIN;
			gameStatus.play = PlayStatusEnum.OFF;
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.OFF, user: UserStatusEnum.UNASSIGNED, result: Result });
			mainSocket.emit("deleteRoom");
		}

		const setLoginCallback = (data: any) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerLeft: {
						...gameplay.playerLeft,
						login: data.left,
					},
					playerRight: {
						...gameplay.playerRight,
						login: data.right,
					}
				}
			})
		}

		const updateRightPlayerCallback = (value: number) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerRight: {
						...gameplay.playerRight,
						position: {
							x: gameplay.playerRight.position.x,
							y: value,
						}
					}
				}
			})
		}

		const updateLeftPlayerCallback = (value: number) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerLeft: {
						...gameplay.playerLeft,
						position: {
							x: gameplay.playerLeft.position.x,
							y: value,
						}
					}
				}
			})
		}

		// const updateBallCallback = (data: UpdateBallDto) => {
		// 	setGameplay((gameplay: Gameplay) => {
		// 		return {
		// 			...gameplay,
		// 			ball: {
		// 				...gameplay.ball,
		// 				position: {
		// 					x: data.posX,
		// 					y: data.posY,
		// 				}
		// 			}
		// 		}
		// 	})
		// }

		const leftLoginCallback = (data: string) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerLeft: {
						...gameplay.playerLeft,
						login: data,
					}
				}
			})
		}
		const rightLoginCallback = (data: string) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerRight: {
						...gameplay.playerRight,
						login: data,
					}
				}
			})
		}

		mainSocket.on("gameStop", gameStopCallback);
		mainSocket.on("setLogin", setLoginCallback);
		mainSocket.on("leftLogin", leftLoginCallback);
		mainSocket.on("rightLogin", rightLoginCallback);
		// mainSocket.on("updateBall", updateBallCallback);
		mainSocket.on("updateRightPlayer", updateRightPlayerCallback);
		mainSocket.on("updateLeftPlayer", updateLeftPlayerCallback);

		return (() => {
			mainSocket.off("gameStop", gameStopCallback);
			mainSocket.off("setLogin", setLoginCallback);
			mainSocket.off("leftLogin", leftLoginCallback);
			mainSocket.off("rightLogin", rightLoginCallback);
			// mainSocket.off("updateBall", updateBallCallback);
			mainSocket.off("updateRightPlayer", updateRightPlayerCallback);
			mainSocket.off("updateLeftPlayer", updateLeftPlayerCallback);
		});
	}, [gameplay]);

	useEffect(() => {
		if (!mainSocket) return;

		const startWatchingCallback = (data: string) => {
			gameStatus.user = UserStatusEnum.WATCHER;
			setGameStatus({ ...gameStatus, user: UserStatusEnum.WATCHER, play: PlayStatusEnum.ON });
			mainSocket?.emit("joinGameAsWatcher", data);
		}

		const pauseGameCallback = () => {
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.PAUSE, })
		}

		const resumeGameCallback = (data: UpdateBallDto) => {
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.ON })
			if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
				mainSocket?.emit("animateGame", data);
			}
		}

		mainSocket.on("startWatching", startWatchingCallback);
		mainSocket.on("pauseGame", pauseGameCallback);
		mainSocket.on("resumeGame", resumeGameCallback);

		return (() => {
			mainSocket.off("startWatching", startWatchingCallback);
			mainSocket.off("pauseGame", pauseGameCallback);
			mainSocket.off("resumeGame", resumeGameCallback);
		})

	}, [gameStatus]);

	useEffect(() => {
		if (!mainSocket) return;

		const gameStartCallback = () => {
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.ON });
			launchGame();
		}

		const setSideCallback = (data: string) => {
			if (data === "left") {
				gameStatus.user = UserStatusEnum.PLAYER_LEFT;
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, user: UserStatusEnum.PLAYER_LEFT }
				})
				setGameplay((gameplay: Gameplay) => {
					return {
						...gameplay,
						playerLeft: {
							...gameplay.playerLeft,
							login: userData.username,
						}
					}
				})
			}
			else if (data === "right") {
				gameStatus.user = UserStatusEnum.PLAYER_RIGHT;
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, user: UserStatusEnum.PLAYER_RIGHT }
				})
				setGameplay((gameplay: Gameplay) => {
					return {
						...gameplay,
						playerRight: {
							...gameplay.playerRight,
							login: userData.username,
						}
					}
				})
			}
		}

		const updateScoreCallback = (data: UpdateBallDto) => {

			let scoreToWin = shortGameScoreToWin;
			if (gameplay.longGame) {
				scoreToWin = longGameScoreToWin;
			}

			let newVelocity: number[] = setRandomBallSpeed();
			let newPosition: number[] = setInitalBallPosition(gameCanvas.width, gameCanvas.height);
			let newRadius: number = setInitialBallRadius(gameCanvas.width);

			newVelocity = setBallSpeed(newVelocity[0], newVelocity[1], gameplay.fast);

			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					ball: {
						velocity: {
							x: newVelocity[0],
							y: newVelocity[1],
						},
						position: {
							x: newPosition[0],
							y: newPosition[1],
						},
						radius: newRadius,
					},
					playerLeft: {
						...gameplay.playerLeft,
						score: data.posX,
					},
					playerRight: {
						...gameplay.playerRight,
						score: data.posY,
					},
				}
			})
			let leave: boolean = false;
			if (gameStatus.user === UserStatusEnum.PLAYER_LEFT) {
				if (data.posX === scoreToWin) {
					leave = true;
				}
				else if (data.posY === scoreToWin) {
					leave = true;
				}
			}

			if (gameStatus.user === UserStatusEnum.PLAYER_RIGHT as UserStatusEnum && leave) {
				mainSocket.emit('leaveGame', data);
			} else if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum && leave) {
				mainSocket.emit('leaveGame', data);
			}
			else {
				mainSocket.emit("animateGame", {
					posX: gameplay.ball.position.x,
					posY: gameplay.ball.position.y,
				} as UpdateBallDto);
			}
		}

		mainSocket.on("gameStart", gameStartCallback);
		mainSocket.on("setSide", setSideCallback);
		mainSocket.on("updateScore", updateScoreCallback);

		return (() => {
			mainSocket.off("gameStatus", gameStartCallback);
			mainSocket.off("setSide", setSideCallback);
			mainSocket.off("updateScore", updateScoreCallback);
		})

	}, [gameStatus, gameplay])

	useEffect(() => {

		const keydownCallback = (event: KeyboardEvent) => {
			handleKeyPressed({ event, setGameplay, gameplay });
		}

		const keyupCallback = (event: KeyboardEvent) => {
			handleKeyUnpressed({ event, setGameplay, gameplay });
		};

		/** Set keyboard listeners */
		window.addEventListener("keydown", keydownCallback);
		window.addEventListener("keyup", keyupCallback);


		if (!mainSocket) return;

		mainSocket.on("GameAlert", (message: string) => {
			dispatch(setNotification(message));
		});

		mainSocket.on("PlayingRequest", (data: any) => {
			console.log("Game request received");
		});

		/** Keyboard event listeners cleanup */
		return () => {
			window.removeEventListener("keydown", keydownCallback);
			window.removeEventListener("keyup", keyupCallback);
		};
	}, []);

}