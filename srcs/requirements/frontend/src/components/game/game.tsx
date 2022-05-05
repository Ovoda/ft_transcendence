import React from 'react';
import { deflateRawSync } from 'zlib';
import startPlayers from './player/player';
import startBall from './ball/ball';
import './game.scss';

export const canvas = document.querySelector('canvas')
export const c = canvas?.getContext('2d')

export var canvas_h = canvas?.height || 0
export var canvas_w = canvas?.width || 0

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