import Ball from "../interfaces/ball.interface";
import Game from '../interfaces/game.interface';

function drawBall(game: Game, ball: Ball) {
	game.context?.beginPath();
	game.context?.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
	game.context?.fill();
	game.context?.stroke();
}

export default drawBall;