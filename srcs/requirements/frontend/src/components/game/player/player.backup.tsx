import React from 'react';

const canvas = document.querySelector('canvas')
const c = canvas?.getContext('2d')


canvas!.width = window.innerWidth
canvas!.height = window.innerHeight
const h_offset : number = canvas!.height / 6
const w_offset : number = canvas!.height / 10

class Player {
	width;
	height;
	position;
	constructor( new_x : number, new_y : number) {
		this.position = {
			x : new_x,
			y : new_y
		}
		this.width = canvas!.width - w_offset
		this.height = canvas!.height - h_offset
	}
	draw() {
		c?.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}


const player1 = new Player(0,  canvas!.height / 2);
const player2 = new Player(canvas!.width - h_offset, canvas!.height / 2);


export default function drawPlayers() {
	player1.draw()
	player2.draw()
}



