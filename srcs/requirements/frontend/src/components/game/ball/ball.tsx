import React from 'react';
import { convertTypeAcquisitionFromJson } from 'typescript';
import drawPlayers from '../player/player';

const canvas = document.querySelector('canvas')
const c = canvas?.getContext('2d')

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
		c?.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI)
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
	c?.clearRect(0, 0, 900, 600)
	ball.update()
	drawPlayers()
}


export default function startBall() {
	animate()
}