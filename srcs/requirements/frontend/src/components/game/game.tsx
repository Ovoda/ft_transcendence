import Ball from './ball/ball';
import { Player } from './player/player';
import { Keys } from './player/player';
import { drawPlayers } from './player/player';
import './game.scss';

let canvas = document.querySelector('canvas');
let c = canvas?.getContext('2d');

//proteger contre type undefined or Null
const ball = new Ball(c!, canvas!);
const player1 = new Player(0, canvas!.height / 2);
const player2 = new Player(canvas!.width + 10, canvas!.height / 2);
const keys = new Keys();

function animate() {
	requestAnimationFrame(animate)
	if (canvas?.width && canvas.height)
		c?.clearRect(0, 0, canvas?.width, canvas?.height)
	if (c) {
		ball.update(c, canvas!, player1, player2);
		drawPlayers(c, keys);
	}
}

function Game() {
	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			<button onClick={() => animate()}>Start Game</button>
			<p></p>
			<canvas id="canvas"></canvas>
		</div>
	);
}

window.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "ArrowDown":
			keys.down = true
			if (c)
				player1.update(c, keys)
			break
		case "ArrowUp":
			keys.up = true
			if (c)
				player1.update(c, keys)
			break
		default:
			return ;
	}
	event.preventDefault();
}, true);

export default Game;