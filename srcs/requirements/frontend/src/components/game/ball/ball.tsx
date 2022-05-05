import React from 'react';
import { convertTypeAcquisitionFromJson } from 'typescript';
import drawPlayers from '../player/player';
import './game.scss';
import { canvas_h, canvas_w, canvas, c  } from '../game';

class Ball {
	radius;
	position;
	velocity;
	constructor() {
		this.position = {
			x: 150,
			y: 69
		}
		this.radius = 10
		this.velocity = {
			x: 1.5,
			y: 0
		}
	}
	draw() {
		c?.beginPath()
		c?.arc(this.position.x, this.position.y, (canvas_h * canvas_w) * ( 1 / 15000), 0, 2 * Math.PI)
		c?.fill();
		c?.stroke()
	}
	update() {
		this.draw()
		this.position.x += this.velocity.x
		if (this.position.x + this.radius + this.velocity.x > 300)
			this.velocity.x = -(this.velocity.x)
		else if (this.position.x === 0)
			this.velocity.x = -(this.velocity.x)
	}
}

const ball = new Ball();

function animate() {
	requestAnimationFrame(animate)
	c?.clearRect(0, 0, canvas_w, canvas_h)
	ball.update()
	drawPlayers()
}


export default function startBall() {
	animate()
}