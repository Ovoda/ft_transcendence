
const canvas = document.querySelector('canvas')
const c = canvas?.getContext('2d')

class Player {
	width;
	height;
	position;
	constructor( new_x : number, new_y : number) {
		this.position = {
			x : new_x,
			y : new_y
		}
		this.width = 10
		this.height = 40
	}
	draw() {
		c?.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}



const player1 = new Player(0,  10);
const player2 = new Player(20, 1000 / 2);


export default function drawPlayers() {
	player1.draw()
	player2.draw()
}



