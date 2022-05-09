
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
	update(c : CanvasRenderingContext2D) {
		this.draw(c)
		this.position.x += this.velocity.x
		if (this.position.x + this.radius + this.velocity.x > 300)
			this.velocity.x = -(this.velocity.x);
		else if (this.position.x === 0)
			this.velocity.x = -(this.velocity.x);
	}
}
