import { setTextRange } from 'typescript';
import drawPlayers from '../player/player';
import { Player } from '../player/player';
import player1 from '../player/player';
import player2 from '../player/player';


function playerColision(ball : Ball, player1: Player, player2: Player) {
	if (ball.position.x <= player1.position.x + player1.width
		&& ball.position.y >= player1.position.y
		&& ball.position.y <= player1.position.y + player1.height)
			return (1)
	else if (ball.position.x >= player2.position.x
		&& ball.position.y >= player2.position.y
		&& ball.position.y <= player2.position.y + player2.height)
			return (2)
	else
		return (0)
	}

class Score {
	player1;
	player2;
	constructor() {
		this.player1 = 0
		this.player2 = 0
	}
	update(c: CanvasRenderingContext2D) {
		let str : string = this.player1.toString() + " : " + this.player2.toString()
		c.font = "10px Arial"
		c.fillText(str, 140, 10)
	}
}

export const score = new Score()

export default class Ball {
	radius;
	position;
	velocity;
	constructor(c : CanvasRenderingContext2D) {
		this.position = {
			x: 150,
			y: 70
		}
		this.radius = 10;
		this.velocity = {
			x: 1.5,
			y: 0
		}
	}
	draw(c : CanvasRenderingContext2D) {
		c?.beginPath();
		c?.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
		c?.fill();
		c?.stroke();
	}
<<<<<<< HEAD
	update(c : CanvasRenderingContext2D) {
		this.draw(c)
		this.position.x += this.velocity.x
		if (this.position.x + this.radius + this.velocity.x > 300)
			this.velocity.x = -(this.velocity.x);
		else if (this.position.x === 0)
=======
	reset(velocity : number) {
		this.position.x = 150;
		this.position.y = 70;
		this.velocity.x = velocity
	}
	endofGame() {

	}
	update(c: CanvasRenderingContext2D) {
		this.draw(c);
		this.position.x += this.velocity.x;
		if (playerColision(this, player1, player2))
>>>>>>> 7094a7a (Implement scores for players)
			this.velocity.x = -(this.velocity.x);
		if (this.position.x === 0) {
			score.player2 += 1
			if (score.player2 >= 10)
				this.endofGame();
			this.reset(1.5)
		}
		else if (this.position.x >= 300) {
			score.player2 +=1
			if (score.player2 >= 10)
				this.endofGame();
			this.reset(-1.5)
		}
	}
}
<<<<<<< HEAD
=======

const ball = new Ball();

export default function animate() {
	let canvas = document.querySelector('canvas');
	let c = canvas?.getContext('2d');
	requestAnimationFrame(animate);
	c?.clearRect(0, 0, 1000, 700);
	if (c) {
		ball.update(c);
		drawPlayers(c);
		score.update(c);
	}
}
>>>>>>> 7094a7a (Implement scores for players)
