import Ball from './ball.interface'
import Player from './player.interface'

export interface GameFront {
	width: number,
	height: number,
	ball: Ball,
	context: CanvasRenderingContext2D | null | undefined,
	playerleft: Player,
	playerright: Player,
}