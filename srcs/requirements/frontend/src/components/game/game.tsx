import Ball from './ball/ball';
import drawPlayers from './player/player';
import './game.scss';
import React, { useEffect } from 'react';

let canvas = document.querySelector('canvas');
let c = canvas?.getContext('2d');

class Score {
	constructor(public player1: number, public player2 : number) {}
}

const score = new Score(0, 0);

const app = document.getElementById("output");
const p = document.createElement("p");
p.textContent = score.player1.toString() + " : " + score.player2.toString();
app?.appendChild(p);

//proteger contre type undefined or Null
const ball = new Ball(c!);

function animate() {

	console.log(canvas);
	requestAnimationFrame(animate)
	c?.clearRect(0, 0, 1000, 700)
	if (c) {
		ball.update(c);
		drawPlayers(c);
	}
}

function Game() {
	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			<p id="output"></p>
			<button onClick={() => animate()}>Start Game</button>
			<p></p>
			<canvas id="canvas"></canvas>
		</div>
	);
}

export default Game;