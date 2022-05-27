import { Player } from '../player/player';

function updateScore(c: CanvasRenderingContext2D, canvas : HTMLCanvasElement, player1 : Player, player2 : Player)
{
	let str : string = player1.score.toString() + "   " + player2.score.toString()
	c.font = "10px Arial"
	c.fillText(str, (canvas.width / 2) - 10, 10)
	c?.fillRect((canvas.width / 2) - 1, 0, 1, canvas.height)
}

function hitWall(ball: Ball, canvas : HTMLCanvasElement) {
	if (ball.position.y - ball.radius <= 0 || ball.position.y + ball.radius >= canvas.height)
		return (1);
	return (0);
}

function playerColisionfront(ball : Ball, player1: Player, player2: Player) {
	if (ball.position.x <= player1.position.x + player1.width
		&& ball.position.y >= player1.position.y
		&& ball.position.y <= player1.position.y + player1.height) {
			//console.log("Front Colison");
			return (1);
	}
	else if (ball.position.x >= player2.position.x
		&& ball.position.y >= player2.position.y
		&& ball.position.y <= player2.position.y + player2.height) {
			//console.log("Front Colison");
			return (1);
	}
	else {
		return (0);
	}
}

function playerColisionSides(ball : Ball, player1: Player, player2 : Player){
	let player : Player;
	let sign : number = 1;
	let coeff : number = 0;
	if (ball.velocity.x > 0)
		player = player2;
	else
	{
		player = player1;
		coeff = 1;
		sign = -1;
	}
	if (ball.position.y <= player.position.y)
	{
		if (ball.position.y + ball.radius >= player.position.y 
			&& (sign * (ball.position.x + (ball.radius * sign))) >= player.position.x + (player.width * coeff)) {
				//console.log("Side Colison Up");
				return (1);
		}
		else
			return (0);
	}
	else if (ball.position.y >= player.position.y + player.height) {
		if (ball.position.y - ball.radius <= player.position.y + player.height
			&& (sign * (ball.position.x + (ball.radius * sign))) >= player.position.x + (player.width * coeff)
			&& (ball.position.x * sign) <= (player.position.x + (coeff * player.width)))
		{
				return (1);
		}
		else
		{
			return (0);
		}
	}
}

function ball_player_ratio ( player : Player, ball : Ball ) : number 
{
	let percent;
	percent = ((ball.position.y - player.position.y) * 2) / (player.height);
	return (percent - 1);
}

export class Ball {
	radius;
	position;
	velocity;
	constructor(canvas : HTMLCanvasElement) {
		this.position = {
			x: canvas?.width / 2,
			y: canvas?.height / 2
		}
		this.radius = Math.sqrt(((0.2 * canvas.width * canvas.height) / 100) / Math.PI);
		this.velocity = {
			x: 2,
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
		this.velocity.x = v;
	}

	endofGame() {

	}

	hitPlayer(player1 : Player, player2 : Player){
		let player : Player;
		let ratio : number;
		let angle : number;
		let k : number;

		if (this.velocity.x > 0)
		{
			player = player2;
			k = 2 * (Math.PI / 6);
		}
		else
		{
			player = player1;
			k = (Math.PI / 6);
		}
		//console.log("k is ", k);
		ratio = ball_player_ratio(player, this);
		angle = ratio * k;
		let x  = this.position.x + (1 * Math.cos(angle));
		let y  = this.position.y + (1 * Math.sin(angle));
		this.velocity.x = this.position.x - x;
		this.velocity.x *= 2
		if (player === player1)
			this.velocity.x *= -1
		//console.log("x.velocity = ", this.velocity.x )
		this.velocity.y = this.position.y - y;
		this.velocity.y *= -2

	}

	update(c: CanvasRenderingContext2D, canvas :  HTMLCanvasElement, player1 : Player, player2 : Player) {
		this.draw(c);
		updateScore(c, canvas, player1, player2);
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		if (playerColisionfront(this, player1, player2) || playerColisionSides(this, player1, player2))
		{
			this.hitPlayer(player1, player2);
		}
		else if (hitWall(this, canvas)) {
			this.velocity.y = -(this.velocity.y);
		}
		else if (this.position.x + (this.radius * 2) <= 0) {
			player2.score += 1;
			if (player2.score >= 10)
				this.endofGame();
			this.reset(1.5, canvas);
		}
		else if (this.position.x - (this.radius * 2) >= canvas.width) {
			player1.score += 1;
			if (player1.score >= 10)
				this.endofGame();
			this.reset(-1.5, canvas);
		}
	}
}
