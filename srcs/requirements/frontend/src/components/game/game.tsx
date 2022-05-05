import React from 'react';
import { deflateRawSync } from 'zlib';
import startPlayers from './player/player';
import startBall from './ball/ball';
import './game.scss';

const canvas = document.querySelector('canvas')
const c = canvas?.getContext('2d')

//canvas.width = window.innerWidth / 1.5
//canvas.height = window.innerHeight / 1.5

console.log(canvas?.width)
console.log(canvas?.height)

function Game() {
	startBall();
	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			<canvas id="canvas"></canvas>
		</div>
	);
}

export default Game;