import React, { Dispatch, SetStateAction } from "react";
import Gameplay from "../interfaces/gameplay.interface";
import Position from "../interfaces/position.interface";
import GameStatus from "../interfaces/gameStatus.interface";
import { UserStatusEnum } from "../enums/userStatus.enum";

export interface handleKeysProps {
	event: KeyboardEvent;
	setGameplay: Dispatch<SetStateAction<Gameplay>>,
	gameStatus: GameStatus,
}

export function handleKeyPressed({ event, setGameplay, gameStatus }: handleKeysProps) {
	if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum || gameStatus.side === UserStatusEnum.PLAYER_RIGHT as UserStatusEnum) {
		if (event.key === "ArrowDown") {
			setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowDown: true } });
		} else if (event.key === "ArrowUp") {
			setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowUp: true } });
		}
	}
}

export function handleKeyUnpressed({ event, setGameplay, gameStatus }: handleKeysProps) {
	if (gameStatus.side === UserStatusEnum.PLAYER_LEFT as UserStatusEnum || gameStatus.side === UserStatusEnum.PLAYER_RIGHT as UserStatusEnum) {
		if (event.key === "ArrowDown") {
			setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowDown: false } });
		} else if (event.key === "ArrowUp") {
			setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowUp: false } });
		}
	}
}


function wallHorizontalCollision(gameplay: Gameplay, gamestatus: GameStatus, height: number) {
	if (gameplay.ball.position.y + gameplay.ball.velocity.y < 0) {
		return true;
	}
	else if (gameplay.ball.position.y + gameplay.ball.velocity.y + gameplay.ball.radius > height) {
		return true;
	}
	return false;
}

function wallVerticalCollision(gameplay: Gameplay, gamestatus: GameStatus, width: number) {
	if (gameplay.ball.position.x + gameplay.ball.velocity.x <= 0) {
		gameplay.playerRight.score += 1;
		return true;
	}
	else if (gameplay.ball.position.x + gameplay.ball.velocity.x >= width) {
		gameplay.playerLeft.score += 1;
		return true;
	}
	return false;
}

function playerLeftCollision(gameplay: Gameplay, gamestatus: GameStatus) {
	if (gameplay.ball.position.y + gameplay.ball.velocity.y >= gameplay.playerLeft.position.y) {
		if (gameplay.ball.position.y + gameplay.ball.velocity.y <= gameplay.playerLeft.position.y + gameplay.playerLeft.height) {
			if (gameplay.ball.position.x + gameplay.ball.velocity.x <= gameplay.playerLeft.position.x + gameplay.playerLeft.width) {
				return true;
			}
		}
	}
}

function playerRightCollision(gameplay: Gameplay, gamestatus: GameStatus) {
	if (gameplay.ball.position.y + gameplay.ball.velocity.y >= gameplay.playerRight.position.y) {
		if (gameplay.ball.position.y + gameplay.ball.velocity.y <= gameplay.playerRight.position.y + gameplay.playerRight.height) {
			if (gameplay.ball.position.x + gameplay.ball.velocity.x >= gameplay.playerRight.position.x) {
				return true;
			}
		}
	}
}

export function getNewBallPos(gameplay: Gameplay, gamestatus: GameStatus, height: number, width: number) {
	let newPos: Position = {
		x: -1,
		y: -1,
	};
	if (wallVerticalCollision(gameplay, gamestatus, width)) {
		return (newPos);
	}
	if (wallHorizontalCollision(gameplay, gamestatus, height)) {
		gameplay.ball.velocity.y = - gameplay.ball.velocity.y;
	}
	else if (playerLeftCollision(gameplay, gamestatus)) {
		gameplay.ball.velocity.y = gameplay.ball.position.y - (gameplay.playerLeft.position.y + (gameplay.playerLeft.height / 2));
		if (gameplay.ball.velocity.y !== 0)
			gameplay.ball.velocity.y /= 100;
		gameplay.ball.velocity.x = - gameplay.ball.velocity.x;
	}
	else if (playerRightCollision(gameplay, gamestatus)) {
		gameplay.ball.velocity.y = (gameplay.ball.position.y - (gameplay.playerRight.position.y + (gameplay.playerRight.height / 2)));
		if (gameplay.ball.velocity.y !== 0)
			gameplay.ball.velocity.y /= 100;
		gameplay.ball.velocity.x = - gameplay.ball.velocity.x;
	}
	newPos.x = gameplay.ball.position.x + gameplay.ball.velocity.x;
	newPos.y = gameplay.ball.position.y + gameplay.ball.velocity.y;
	return (newPos)
}