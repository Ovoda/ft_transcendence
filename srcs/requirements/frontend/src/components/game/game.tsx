import { Ball } from './ball/ball';
import { Player } from './player/player';
import { Keys } from './player/player';
import { drawPlayers } from './player/player';
import './game.scss';
import { useEffect } from 'react';

interface CanvasInterface {
	canvas: HTMLCanvasElement | null | undefined,
	c : CanvasRenderingContext2D | null | undefined,
	ball: Ball,
	player1: Player,
	player2 : Player,
	keys: Keys
}

var start = 0

function initGame(oldjson : CanvasInterface) {
	let json: CanvasInterface;
	if (start === 0)
	{
		let canvas = document.querySelector('canvas');
		let c = canvas?.getContext('2d');

		//proteger contre type undefined or Null
		const ball = new Ball(c!, canvas!);
		const player1 = new Player(0, canvas!.height / 2);
		const player2 = new Player(canvas!.width - 10, canvas!.height / 2);
		const keys = new Keys();
		json = {
			"canvas": canvas,
			"c": c,
			"ball": ball,
			"player1": player1,
			"player2": player2,
			"keys": keys
		};
		start = 1
	}
	else {
		json = oldjson
	}
	return json;
}

let json : CanvasInterface

function animate() {
	json = initGame(json);
	requestAnimationFrame(animate)
	if (json?.c && json?.canvas)
	{
		json.c.clearRect(0, 0, json.canvas.width, json.canvas.height)
		json.ball.update(json.c, json.canvas, json.player1, json.player2);
		drawPlayers(json.c, json.keys);
		window.addEventListener("keydown", function (event) {
		switch (event.key) {
			case "ArrowDown":
				json.keys.down = true
				if (json.c)
					json.player1.update(json.c, json.keys)
				break
			case "ArrowUp":
				json.keys.up = true
				if (json.c)
					json.player1.update(json.c, json.keys)
				break
			default:
				return ;
			}
			event.preventDefault();
		}, true);
	}
}

function Game() {
	useEffect(()=>{
		animate()
	})
	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			<button onClick={() => animate()}>Start Game</button>
			<p></p>
			<canvas id="canvas"></canvas>
		</div>
	);
}

export default Game;