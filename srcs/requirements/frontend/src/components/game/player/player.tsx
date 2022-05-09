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
	constructor( new_x : number, new_y : number) {
		this.position = {
			x : new_x,
			y : new_y
		}
		this.score = 0
		this.width = 10
		this.height = 40
		this.velocity = {
			x: 0,
			y: 5
		}
	}
	draw(c: CanvasRenderingContext2D) {
		c?.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(c: CanvasRenderingContext2D, keys : Keys) {
		this.draw(c)
		if (this.position.y + this.height + 3 <= 150) // add height of canvas later
			if (keys.down === true)
				this.position.y += 3
				keys.down = false
		if (this.position.y + 3 >= 0)
			if (keys.up === true)
				this.position.y -= 3
				keys.up = false;
	}
}

export const player1 = new Player(0,  50);
export const player2 = new Player(290, 50);

export function drawPlayers(c: CanvasRenderingContext2D, keys : Keys) {
	if (c) {
		player1.update(c, keys)
		player2.draw(c)
	}
}

