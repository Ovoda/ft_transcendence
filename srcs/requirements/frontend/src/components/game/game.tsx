import animate from './ball/ball';
import './game.scss';

export const canvas = document.querySelector('canvas')
export const c = canvas?.getContext('2d')


class Score {
	player1;
	player2;
	constructor() {
		this.player1 = 0
		this.player2 = 0
	}
}

const score = new Score()

function Game() {
	animate();
	return (
		<div className="main">
			<p>Welcome to the Pong Game</p>
			<p>Score</p>
			<p id="output"></p>
			<canvas id="canvas"></canvas>
		</div>
	);
}

const app = document.getElementById("output");
const p = document.createElement("p");
p.textContent = score.player1.toString() + " : " + score.player2.toString();
app?.appendChild(p);

export default Game;