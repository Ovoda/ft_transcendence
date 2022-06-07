import Ball from './ball.interface'
import Player from './player.interface'

interface FullGame {
	width: number,
	height: number,
	ball: Ball,
	context: CanvasRenderingContext2D | null | undefined,
	playerleft: Player,
	playerright: Player,
}

export default FullGame;