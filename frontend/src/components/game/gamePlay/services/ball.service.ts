import Ball from "../interfaces/ball.interface";
import GameCanvas from "../interfaces/gameCanvas.interface";

function drawBall(game: GameCanvas, ball: Ball) {
	if (!game.context) { return; }
	game.context.fillStyle = game.elements_color;
	game.context?.beginPath();
	game.context?.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
	game.context?.fill();
	game.context?.stroke();
}

export default drawBall;