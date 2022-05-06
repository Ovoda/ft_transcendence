import animate from './ball/ball';
import './game.scss';

export const canvas = document.querySelector('canvas')
export const c = canvas?.getContext('2d')

function Game() {
	animate();
	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			<canvas id="canvas"></canvas>
		</div>
	);
}

export default Game;