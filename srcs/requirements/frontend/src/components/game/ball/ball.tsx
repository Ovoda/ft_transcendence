import drawPlayers from '../player/player';

class Ball {
	radius;
	position;
	velocity;
	constructor() {
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
	draw(c: CanvasRenderingContext2D) {
		c?.fillRect(this.position.x, this.position.y, this.radius, this.radius)
	}
	update(c: CanvasRenderingContext2D) {
		this.draw(c);
		this.position.x += this.velocity.x;
		if (this.position.x + this.radius + this.velocity.x > 300)
			this.velocity.x = -(this.velocity.x);
		else if (this.position.x === 0)
			this.velocity.x = -(this.velocity.x);
	}
}

const ball = new Ball();

export default function animate() {
	let canvas = document.querySelector('canvas');
	let c = canvas?.getContext('2d');
	console.log(canvas);
	requestAnimationFrame(animate);
	c?.clearRect(0, 0, 1000, 700);
	if (c) {
		ball.update(c);
		drawPlayers(c);
	}
}
