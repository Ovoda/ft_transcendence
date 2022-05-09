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
	update(c: CanvasRenderingContext2D, keys : Keys, canvas: HTMLCanvasElement) {
		this.draw(c)
		if (this.position.y + this.height + 1 <= canvas.height) {
			if (keys.down === true) {
				console.log(keys.down)
				this.position.y += 1
				keys.down = false
			}
		}
		if (this.position.y + 1 >= 0) {
			if (keys.up === true) {
				console.log(keys.up)
				this.position.y -= 1
				keys.up = false;
			}
		}
	}
}

export function drawPlayers(canvas: HTMLCanvasElement, c: CanvasRenderingContext2D, keys : Keys, player1 : Player, player2 : Player) {
	if (c) {
		player1.update(c, keys, canvas)
		player2.draw(c)
	}
}