import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { socketContext } from "../App";
import Ball from "src/components/game/interfaces/ball.interface";
import Player from "src/components/game/interfaces/player.interface";
import UpdateBallDto from "./interfaces/UpdateBall.dto";
import { handleKeyPressed, handleKeyUnpressed } from "../components/game/services/game.service";
import GameStatus, { initialGameStatus } from "src/components/game/interfaces/gameStatus.interface";
import { UserStatusEnum } from "../components/game/enums/userStatus.enum";
import Gameplay from "src/components/game/interfaces/gameplay.interface";
import Position from "src/components/game/interfaces/position.interface";
import { resetPlayerLeftPosition, resetPlayerRightPosition } from '../components/game/interfaces/player.interface';
import { setInitialBallState } from '../components/game/interfaces/ball.interface';
import GameCanvas from "src/components/game/interfaces/gameCanvas.interface";
import { Socket } from "socket.io-client";

const scoreToWin: number = 10;

interface Props {
	setGameplay: Dispatch<SetStateAction<Gameplay>>,
	gameplay: Gameplay,
	setGameStatus: Dispatch<SetStateAction<GameStatus>>;
	gameStatus: GameStatus;
	setGameCanvas: Dispatch<SetStateAction<GameCanvas>>,
	gameCanvas: GameCanvas;
}

export function useGameListeners({ gameplay, setGameplay, gameStatus, setGameStatus, gameCanvas, setGameCanvas }: Props) {

	const mainSocket = useContext(socketContext);

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
			console.log("LOSER IS");
			console.log(stopclient);
			console.log("I AM");
			console.log(mainSocket.socket.id);
			const winResult = stopclient === mainSocket.socket.id ? "You Lost!" : "You Won!";

			setGameStatus((gameStatus: GameStatus) => {
				return { ...gameStatus, start: true, side: 0, win: winResult };
			});

			mainSocket.emit("deleteRoom");
		});

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

		mainSocket.on("setSide", (data: string) => {
			if (data === "left") {
				gameStatus.side = UserStatusEnum.PLAYER_LEFT;
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, side: UserStatusEnum.PLAYER_LEFT }
				})
			}
			else if (data === "right") {
				gameStatus.side = UserStatusEnum.PLAYER_RIGHT;
				setGameStatus((gameStatus: GameStatus) => {
					return { ...gameStatus, side: UserStatusEnum.PLAYER_RIGHT }
				})
			}
		})

		mainSocket.on("updateScore", (data: UpdateBallDto) => {
			setGameplay((gameplay: Gameplay) => {
				return {
					...gameplay,
					ball: setInitialBallState(gameCanvas.width, gameCanvas.height),
					playerLeft: resetPlayerLeftPosition(gameCanvas.width, gameCanvas.height, data.posX),
					playerRight: resetPlayerRightPosition(gameCanvas.width, gameCanvas.height, data.posY),
				}
			})
			if (data.posX === scoreToWin) {
				if (gameStatus.side === UserStatusEnum.PLAYER_RIGHT as UserStatusEnum) {
					mainSocket.emit('leaveGame');
				}
			}
			else if (data.posY === scoreToWin) {
				if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum) {
					mainSocket.emit('leaveGame');
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
				}));
			window.addEventListener("keyup",
				(event: KeyboardEvent) => handleKeyUnpressed({
					event,
					setGameplay,
				}));
		};
	}, []);
}