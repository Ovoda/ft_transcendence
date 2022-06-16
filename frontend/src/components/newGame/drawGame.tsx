import Ball from "./interfaces/ball.interface";
import Player from "./interfaces/player.interface";


export function drawGame(
	context: CanvasRenderingContext2D,
	ball: Ball,
	players: Player[],
	scores: number[],
	canvaHeight: number,
	canvaWidth: number,
	userLogins: string[],
) {
	const ratio = canvaWidth / 600;

	context.fillStyle = "white";
	context.clearRect(0, 0, canvaWidth, canvaHeight);
	context.fillRect(0, 0, canvaWidth, canvaHeight);

	context.fillStyle = "black";
	context.fillRect(canvaWidth / 2 - 1, 0, 2, canvaHeight);

	var r_a = 0.1;
	context.fillStyle = "rgba(0, 0, 0, " + r_a + ")";
	const fontSize = 100 * ratio;
	context.font = fontSize.toString() + 'px Lato';
	context.textAlign = 'center';
	context.fillText(scores[0].toString(), 150 * ratio, 230 * ratio);
	context.fillText(scores[1].toString(), 450 * ratio, 230 * ratio);

	var r_a = 0.1;
	context.fillStyle = "rgba(0, 0, 0, " + r_a + ")";
	context.font = (fontSize * 0.2).toString() + 'px Lato';
	context.fillText(userLogins[0], 450 * ratio, 330 * ratio);
	context.fillText(userLogins[1], 150 * ratio, 330 * ratio);

	context.beginPath();
	context.fillStyle = "black";
	context.arc(ball.x * ratio, ball.y * ratio, ball.radius * ratio, 0, 2 * Math.PI);
	context.fill();
	context.stroke();


	context.fillStyle = "black";
	context.fillRect(players[0].x * ratio, players[0].y * ratio, players[0].width * ratio, players[0].height * ratio);
	context.fillStyle = "black";
	context.fillRect(players[1].x * ratio, players[1].y * ratio, players[1].width * ratio, players[1].height * ratio);
}