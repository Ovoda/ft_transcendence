import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { mainSocketContext } from "../App";
import Ball from "src/components/game/interfaces/ball.interface";
import Player from "src/components/game/interfaces/player.interface";
import UpdateBallDto from "./interfaces/UpdateBall.dto";
import { handleKeyPressed, handleKeyUnpressed } from "../components/game/services/game.service";
import GameStatus, { initialGameStatus } from "src/components/game/interfaces/gameStatus.interface";
import { UserStatusEnum } from "../components/game/enums/userStatus.enum";
import Gameplay from "src/components/game/interfaces/gameplay.interface";
import Position from "src/components/game/interfaces/position.interface";

interface Props {
    setGameplay: Dispatch<SetStateAction<Gameplay>>,
    gameplay: Gameplay,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>;
    gameStatus: GameStatus;
}

export function useGameListeners({ gameplay, setGameplay, setGameStatus, gameStatus }: Props) {

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
            const winResult = stopclient === mainSocket.id ? "You Lost!" : "You Won!";

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
                if (gameStatus.side === UserStatusEnum.UNASSIGNED as UserStatusEnum) {

                    // TODO
                    // setGameStatus((gameStatus: GameStatus) => {
                    //     return { ...gameStatus, side: UserStatusEnum.PLAYER_RIGHT }
                    // });

                    mainSocket.emit("animateGame", {
                        posX: gameplay.ball.position.x,
                        posY: gameplay.ball.position.y
                    } as UpdateBallDto);
                }
            } else {
                setGameStatus((gameStatus: GameStatus) => {
                    return { ...gameStatus, side: UserStatusEnum.PLAYER_LEFT }
                });
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
            console.log("Update Player Left: ", value);
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
            console.log("Update Player Right");

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