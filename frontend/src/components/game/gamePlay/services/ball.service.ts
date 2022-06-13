import Ball from "../interfaces/ball.interface";
import GameCanvas from "../interfaces/gameCanvas.interface";
import Gameplay from "../interfaces/gameplay.interface";

function drawBall(game: GameCanvas, ball: Ball) {
	if (!game.context) { return; }
	game.context.strokeStyle = game.elements_color;
	game.context.fillStyle = game.elements_color;
	game.context?.beginPath();
	game.context?.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
	game.context?.fill();
	game.context?.stroke();
}

export function setBallSpeed(velocityX: number, velocityY: number, fastMode: boolean) {

	let newVX: number = velocityX;
	let newVY: number = velocityY;

	if (fastMode) {
		newVX = newVX + 2;
		newVY = newVY + 2;
		if (velocityX < 0) {
			newVX = velocityX - 2;
		}
		if (velocityY < 0) {
			newVY = velocityY - 2;
		}
	}
	else {
		newVX = newVX - 2;
		newVY = newVY - 2;
		if (velocityX < 0) {
			newVX = velocityX + 2;
		}
		if (velocityY < 0) {
			newVY = velocityY + 2;
		}
	}
	return ([newVX, newVY]);
}

export default drawBall;