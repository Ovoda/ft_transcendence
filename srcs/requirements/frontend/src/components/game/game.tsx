import { Ball } from './ball/ball';
import { Player } from './player/player';
import { Keys } from './player/player';
import { drawPlayers } from './player/player';
import './game.scss';

interface CanvasInterface {
	canvas: HTMLCanvasElement | null | undefined,
	c : CanvasRenderingContext2D | null | undefined,
	ball: Ball,
	player1: Player,
	player2 : Player,
	keys_1 : Keys,
	keys_2: Keys
}

var start = 0

function initGame(oldjson : CanvasInterface) {
	let json: CanvasInterface;
	if (start === 0)
	{
		let canvas = document.querySelector('canvas');
		let c = canvas?.getContext('2d');

		const ball = new Ball(c!, canvas!);
		const player1 = new Player(0, canvas!.width, canvas!.height);
		const player2 = new Player(canvas!.width - (canvas!.width / 50), canvas!.width, canvas!.height);
		const keys_1 = new Keys();
		const keys_2 = new Keys();
		json = {
			"canvas": canvas,
			"c": c,
			"ball": ball,
			"player1": player1,
			"player2": player2,
			"keys_1": keys_1,
			"keys_2": keys_2
		};
		start = 1;
	}
	else {
		json = oldjson;
	}
	return json;
}

let json : CanvasInterface

function animate() {
	json = initGame(json);
	requestAnimationFrame(animate)
	if (json?.c && json?.canvas)
	{
		json.c.clearRect(0, 0, json.canvas.width, json.canvas.height);
		drawPlayers(json.canvas, json.c, json.keys_1, json.player1, json.keys_2, json.player2);
		json.ball.update(json.c, json.canvas, json.player1, json.player2);
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
			json.keys_1.down = true;
			json.keys_2.down = true;
			if (json.c && json.canvas)
				{json.player1.update(json.c, json.keys_1, json.canvas);
				json.player2.update(json.c, json.keys_2, json.canvas);}
			break ;
		case "ArrowUp":
			json.keys_1.up = true;
			json.keys_2.up = true;
			if (json.c && json.canvas)
				{json.player1.update(json.c, json.keys_1, json.canvas);
				json.player2.update(json.c, json.keys_2, json.canvas);}
			break ;
		default:
			return ;
		}
		event.preventDefault();
	}, true);

export default Game;