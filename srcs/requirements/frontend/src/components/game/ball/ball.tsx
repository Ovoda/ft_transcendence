import { Player } from '../player/player';

function updateScore(c: CanvasRenderingContext2D, canvas : HTMLCanvasElement, player1 : Player, player2 : Player)
{
	let str : string = player1.score.toString() + " : " + player2.score.toString()
	c.font = "10px Arial"
	c.fillText(str, canvas.width / 2, 10)
}

function playerColision(ball : Ball, player1: Player, player2: Player) {
	if (ball.position.x <= player1.position.x + player1.width
		&& ball.position.y >= player1.position.y
		&& ball.position.y <= player1.position.y + player1.height) {
			return (1)
	}
	else if (ball.position.x >= player2.position.x
		&& ball.position.y >= player2.position.y
		&& ball.position.y <= player2.position.y + player2.height) {
			return (1)
	}
	else {
		return (0)
	}
}

export class Ball {
	radius;
	position;
	velocity;
	constructor(c : CanvasRenderingContext2D, canvas : HTMLCanvasElement) {
		this.position = {
			x: canvas?.width / 2,
			y: canvas?.height / 2
		}
		this.radius = 5;
		this.velocity = {
			x: 1.5,
			y: 0
		}
	}
	draw(c : CanvasRenderingContext2D) {
		c?.beginPath();
		c?.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		c?.fill();
		c?.stroke();
	}
	reset(v : number, canvas : HTMLCanvasElement) {
		this.position.x = canvas.width / 2;
		this.position.y = canvas.height / 2;
		this.velocity.x = v
	}
	endofGame() {

	}
	update(c: CanvasRenderingContext2D, canvas :  HTMLCanvasElement, player1 : Player, player2 : Player) {
		this.draw(c);
		updateScore(c, canvas, player1, player2)
		this.position.x += this.velocity.x;
		if (playerColision(this, player1, player2))
			this.velocity.x = -(this.velocity.x);
		else if (this.position.x <= 0) {
			player2.score += 1
			if (player2.score >= 10)
				this.endofGame();
			this.reset(1.5, canvas)
		}
		else if (this.position.x >= canvas.width) {
			player1.score +=1
			if (player1.score >= 10)
				this.endofGame();
			this.reset(-1.5, canvas)
		}
	}
}
