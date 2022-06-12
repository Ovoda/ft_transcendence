import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import UpdateBallDto from "./interfaces/UpdateBall.dto";
import { getNewBallPos, handleKeyPressed, handleKeyUnpressed } from "../components/game/gamePlay/services/play.service";
import GameStatus from "src/components/game/gamePlay/interfaces/gameStatus.interface";
import { UserStatusEnum } from "../components/game/gamePlay/enums/userStatus.enum";
import { PlayStatusEnum } from "../components/game/gamePlay/enums/playStatus.enum";
import { ResultStatusEnum } from "../components/game/gamePlay/enums/resultStatus.enum";
import Gameplay from "src/components/game/gamePlay/interfaces/gameplay.interface";
import { setInitialBallState } from '../components/game/gamePlay/interfaces/ball.interface';
import GameCanvas from "src/components/game/gamePlay/interfaces/gameCanvas.interface";
import { Store } from '../app/store';
import { useSelector } from "react-redux";
import UserData from "features/user/interfaces/user.interface";
import { mainSocketContext } from "src";

const shortGameScoreToWin: number = 21;
const longGameScoreToWin: number = 42;

interface Props {
	setGameplay: Dispatch<SetStateAction<Gameplay>>,
	gameplay: Gameplay,
	setGameStatus: Dispatch<SetStateAction<GameStatus>>;
	gameStatus: GameStatus;
	setGameCanvas: Dispatch<SetStateAction<GameCanvas>>,
	gameCanvas: GameCanvas;
}

export function useGameListeners({ gameplay, setGameplay, gameStatus, setGameStatus, gameCanvas, setGameCanvas }: Props) {

	const store: Store = useSelector((store: Store) => store);
	const userData: UserData = store.user;
	const mainSocket = useContext(mainSocketContext);

	useEffect(() => {

		/** Set keyboard listeners */
		window.addEventListener("keydown",
			(event: KeyboardEvent) => handleKeyPressed({
				event,
				setGameplay,
			}));
		window.addEventListener("keyup",
			(event: KeyboardEvent) => handleKeyUnpressed({
				event,
				setGameplay,
			}));


		if (!mainSocket) return;

		/** Set socket listener */
		mainSocket.on("gameStop", (stopclient: string) => {
			const Result = stopclient === mainSocket.socket.id ? ResultStatusEnum.LOOSE : ResultStatusEnum.WIN;
			gameStatus.play = PlayStatusEnum.OFF;
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.OFF, user: UserStatusEnum.UNASSIGNED, result: Result });
			mainSocket.emit("deleteRoom");
		});

		/**  Watcher joins game room **/
		mainSocket.on("startWatching", (data: string) => {
			gameStatus.user = UserStatusEnum.WATCHER;
			setGameStatus({ ...gameStatus, user: UserStatusEnum.WATCHER, play: PlayStatusEnum.ON });
			mainSocket?.emit("joinGameAsWatcher", data);
		})

		/** Set status of Room */
		mainSocket.on("gameStatus", (fullRoom: any) => {
			if (fullRoom === false) {
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, play: PlayStatusEnum.PENDING };
				})
			} else {
				setGameStatus({ ...gameStatus, play: PlayStatusEnum.ON });
				if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
					console.log("Socket gameStatus speed: ", gameplay.ball.velocity);
					console.log("Game fast speed?: ", gameplay.fast);
					mainSocket.emit("animateGame", {
						posX: gameplay.ball.position.x,
						posY: gameplay.ball.position.y
					} as UpdateBallDto);
				}
			}
		})

		/** Pause the game **/
		mainSocket.on("pauseGame", () => {
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.PAUSE, })
		})

		/** Resume the Game  **/
		mainSocket.on("resumeGame", (data: UpdateBallDto) => {
			setGameStatus({ ...gameStatus, play: PlayStatusEnum.ON })
			if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
				console.log("Socket resumeGame speed: ", gameplay.ball.velocity);
				mainSocket?.emit("animateGame", data);
			}
		})

		/** Set logins of players **/
		mainSocket.on("leftLogin", (data: string) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerLeft: {
						...gameplay.playerLeft,
						login: data,
					}
				}
			})
		})

		mainSocket.on("rightLogin", (data: string) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					playerRight: {
						...gameplay.playerRight,
						login: data,
					}
				}
			})
		})


		/** Set sides of players */
		mainSocket.on("setSide", (data: string) => {
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
							login: userData.login,
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
							login: userData.login,
						}
					}
				})
			}
		})

		mainSocket.on("updateScore", (data: UpdateBallDto) => {
			let scoreToWin = shortGameScoreToWin;
			if (gameplay.longGame) {
				scoreToWin = longGameScoreToWin;
			}
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					ball: setInitialBallState(gameCanvas.width, gameCanvas.height),
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
			if (data.posX === scoreToWin) {
				if (gameStatus.user === UserStatusEnum.PLAYER_RIGHT as UserStatusEnum) {
					mainSocket.emit('leaveGame', data);
				}
			}
			else if (data.posY === scoreToWin) {
				if (gameStatus.user === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
					mainSocket.emit('leaveGame', data);
				}
			}
			else {
				console.log("Socket updateScore speed: ", gameplay.ball.velocity);
				mainSocket.emit("animateGame", {
					posX: gameplay.ball.position.x,
					posY: gameplay.ball.position.y,
				} as UpdateBallDto);
			}
		})

		mainSocket.on("updateBall", (data: UpdateBallDto) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					ball: {
						...gameplay.ball,
						position: {
							x: data.posX,
							y: data.posY,
						}
					}
				}
			})
		})

		mainSocket.on("updateLeftPlayer", (value: number) => {
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
		})

		mainSocket.on("updateRightPlayer", (value: number) => {
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
		})

		mainSocket.on("setLogin", (data: any) => {
			console.log("RECEIVED LOGINS");
			console.log(data);
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
		})

		mainSocket.on("PlayingRequest", (data: any) => {
			console.log("Game request received");
		})

		/** Keyboard event listeners cleanup */
		return () => {
			window.addEventListener("keydown",
				(event: KeyboardEvent) => handleKeyPressed({
					event,
					setGameplay,
				}));
			window.addEventListener("keyup",
				(event: KeyboardEvent) => handleKeyUnpressed({
					event,
					setGameplay,
				}));
		};
	}, []);
}