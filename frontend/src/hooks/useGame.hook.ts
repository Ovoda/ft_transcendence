import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { mainSocketContext } from "../App";
import UpdateBallDto from "./interfaces/UpdateBall.dto";
import UpdateScoreDto from "./interfaces/UpdateScore.dto";
import { handleKeyPressed, handleKeyUnpressed } from "../components/game/services/play.service";
import GameStatus from "src/components/game/interfaces/gameStatus.interface";
import { UserStatusEnum } from "../components/game/enums/userStatus.enum";
import Gameplay from "src/components/game/interfaces/gameplay.interface";
import { setInitialBallState } from '../components/game/interfaces/ball.interface';
import GameCanvas from "src/components/game/interfaces/gameCanvas.interface";
import { login } from "services/auth.service";
import { Store } from '../app/store';
import { useSelector } from "react-redux";
import UserData from "features/user/interfaces/user.interface";

const scoreToWin: number = 50;

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

		/**  start watching game of user **/

		/** Set keyboard listeners */
		window.addEventListener("keydown",
			(event: KeyboardEvent) => handleKeyPressed({
				event,
				setGameplay,
				gameStatus,
			}));
		window.addEventListener("keyup",
			(event: KeyboardEvent) => handleKeyUnpressed({
				event,
				setGameplay,
				gameStatus,
			}));


		if (!mainSocket) return;

		/** Set socket listener */
		mainSocket.on("gameStop", (stopclient: string) => {
			const winResult = stopclient === mainSocket.socket.id ? "You Lost!" : "You Won!";

			setGameStatus((gameStatus: GameStatus) => {
				return { ...gameStatus, start: true, side: 0, win: winResult };
			});

			mainSocket.emit("deleteRoom");
		});

		/**  Watcher joins game room **/
		mainSocket.on("startWatching", (data: string) => {
			console.log("Starting Watching: ");
			console.log(data);
			setGameStatus({ ...gameStatus, side: UserStatusEnum.WATCHER, start: false, win: "", watch: true, ready: true })
			mainSocket?.emit("joinGameAsWatcher", data);
		})

		/** Set status of Room */
		mainSocket.on("gameStatus", (fullRoom: any) => {
			setGameStatus((gameStatus: GameStatus) => {
				return { ...gameStatus, ready: fullRoom };
			});

			if (fullRoom === true) {
				if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
					mainSocket.emit("animateGame", {
						posX: gameplay.ball.position.x,
						posY: gameplay.ball.position.y
					} as UpdateBallDto);
				}
			}
		})


		/** Set logins of players */
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
				gameStatus.side = UserStatusEnum.PLAYER_LEFT;
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, side: UserStatusEnum.PLAYER_LEFT }
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
				gameStatus.side = UserStatusEnum.PLAYER_RIGHT;
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, side: UserStatusEnum.PLAYER_RIGHT }
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
				if (gameStatus.side === UserStatusEnum.PLAYER_RIGHT as UserStatusEnum) {
					mainSocket.emit('leaveGame', data);
				}
			}
			else if (data.posY === scoreToWin) {
				if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
					mainSocket.emit('leaveGame', data);
				}
			}
			else {
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

		/** Keyboard event listeners cleanup */
		return () => {
			window.addEventListener("keydown",
				(event: KeyboardEvent) => handleKeyPressed({
					event,
					setGameplay,
					gameStatus,
				}));
			window.addEventListener("keyup",
				(event: KeyboardEvent) => handleKeyUnpressed({
					event,
					setGameplay,
					gameStatus,
				}));
		};
	}, []);
}