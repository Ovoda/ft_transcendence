export let canvas = document.querySelector('canvas')
export let c = canvas?.getContext('2d')

const keys = {
	up: {
		pressed: false
	},
	down: {
		pressed: false
	}
}

export class Player {
	width;
	height;
	position;
	velocity;
	constructor( new_x : number, new_y : number) {
		this.position = {
			x : new_x,
			y : new_y
		}
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
	update(c: CanvasRenderingContext2D) {
		this.draw(c)
		if (this.position.y + this.height + 3 <= 150) // add height of canvas later
			if (keys.down.pressed == true)
				this.position.y += 3
				keys.down.pressed = false
		if (this.position.y + 3 >= 0)
			if (keys.up.pressed == true)
				this.position.y -= 3
				keys.up.pressed = false;
	}
}

export const player1 = new Player(0,  50);
export const player2 = new Player(290, 50);

export default function drawPlayers(c: CanvasRenderingContext2D | null | undefined) {
	if (c) {
		player1.update(c)
		player2.draw(c)
	}
}

window.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "ArrowDown":
			keys.down.pressed = true
			if (c)
				player1.update(c)
			break
		case "ArrowUp":
			keys.up.pressed = true
			if (c)
				player1.update(c)
			break
		default:
			return ;
	}
	event.preventDefault();
}, true);