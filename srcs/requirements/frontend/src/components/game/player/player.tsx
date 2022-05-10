export class Keys {
	up;
	down;
	constructor() {
		this.up = false
		this.down =  false
	}
}

export class Player {
	width;
	height;
	position;
	velocity;
	score;
	constructor( pos : number, width : number, height : number) {

		this.score = 0;
		this.width = width / 50;
		this.height = height / 3;
		this.velocity = {
			x: 0,
			y: 3
		}
		this.position = {
			x : pos,
			y : (height / 2) - (this.height / 2)
		}
	}
	draw(c: CanvasRenderingContext2D) {
		c?.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(c: CanvasRenderingContext2D, keys : Keys, canvas: HTMLCanvasElement) {
		if (this.position.y + this.height <= canvas.height) {
			if (keys.down === true) {
				this.position.y += this.velocity.y
				keys.down = false
			}
		}
		if (this.position.y + this.velocity.y > 0) {
			if (keys.up === true) {
				this.position.y -= this.velocity.y
				keys.up = false;
			}
		}
		console.log(this.position.y);
		this.draw(c)
	}
}

export async function drawPlayers(canvas: HTMLCanvasElement, c: CanvasRenderingContext2D, keys : Keys, player1 : Player, player2 : Player) {
	if (c) {
		player2.update(c, keys, canvas)
		player1.update(c, keys, canvas)
	}
}