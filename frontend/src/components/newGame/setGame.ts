import { GameStatusEnum } from "./enums/gameStatus.enum";
import Ball from "./interfaces/ball.interface";
import Player from "./interfaces/player.interface";


export default function setGame(): {
	gameStatus: GameStatusEnum,
	isWatching: boolean,
	isCurrentRight: boolean,
	scores: number[],
	currentGameRoomId: string,
	ball: Ball,
	players: Player[],
} {
	let gameStatus: GameStatusEnum = GameStatusEnum.OFF;
	let isWatching = false;
	let isCurrentRight = false;
	let currentGameRoomId = "";
	let scores: number[] = [0, 0];

	const ball: Ball = {
		x: 600 / 2, y: 400 / 2, vy: 3, vx: 3, radius: 5
	};
	const players: Player[] = [{
		x: 0,
		y: 200 - 80 / 2,
		velocity: 10,
		height: 80,
		width: 10,
		side: false,
		goUp: false,
		goDown: false,
	},
	{
		x: 600 - 10,
		y: 200 - 80 / 2,
		velocity: 10,
		height: 80,
		width: 10,
		side: true,
		goUp: false,
		goDown: false,
	}];

	return { gameStatus, isWatching, isCurrentRight, scores, currentGameRoomId, ball, players };
}