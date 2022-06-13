import Ball, { setInitialBallState } from "./ball.interface";
import Player, { setInitialPlayerLeftState, setInitialPlayerRightState } from "./player.interface";

export default interface Gameplay {
	fast: boolean;
	longGame: boolean;
	arrowUp: boolean;
	arrowDown: boolean;
	ball: Ball;
	playerLeft: Player;
	playerRight: Player;
}

export function setInitialGameplayState(windowWidth: number, windowHeight: number) {

	return ({
		fast: false,
		longGame: false,
		arrowUp: false,
		arrowDown: false,
		ball: setInitialBallState(windowWidth, windowHeight),
		playerLeft: setInitialPlayerLeftState(windowWidth, windowHeight),
		playerRight: setInitialPlayerRightState(windowWidth, windowHeight),
	});
}