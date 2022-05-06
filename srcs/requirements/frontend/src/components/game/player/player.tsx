export const canvas = document.querySelector('canvas')
export const c = canvas?.getContext('2d')
const keys = {
	up: {
		pressed: false
	},
	down: {
		pressed: false
	}
}

class Player {
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
			y: 3
		}
	}
	draw() {
		c?.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update() {
		this.draw()
		if (this.position.y + this.height + 3 <= 150) // add height of canvas later
			if (keys.down.pressed == true)
				this.position.y += 3
				keys.down.pressed = false
				console.log(this.position.y)
		if (this.position.y + 3 >= 0)
			if (keys.up.pressed == true)
				this.position.y -= 3
				keys.up.pressed = false;
	}
}

const player1 = new Player(0,  50);
const player2 = new Player(290, 50);

export default function drawPlayers() {
	player1.update()
	player2.draw()
}

window.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "ArrowDown":
		console.log(event.key)
			keys.down.pressed = true
			player1.update()
			break
		case "ArrowUp":
			console.log(event.key)
			keys.up.pressed = true
			player1.update()
			break
		default:
			return ;
	}
	event.preventDefault();
}, true);