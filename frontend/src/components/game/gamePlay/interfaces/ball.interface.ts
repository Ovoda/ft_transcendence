import GamePlay from '../gamePlay';
import Position from './position.interface'

interface Ball {
	radius: number;
	position: Position;
	velocity: Position;
}

export default Ball;


function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function getHighSpeed(n: number) {
	if (n < 0) {
		n = n - 0.3;
	} else {
		n = n + 0.3;
	}
	return n;
}

export function setInitialBallState(windowWidth: number, windowHeight: number) {

	let x: number = getRandomArbitrary(-0.5, 0.5);
	let y: number = getRandomArbitrary(-0.5, 0.5);

	return ({
		velocity: {
			x: getHighSpeed(x),
			y: getHighSpeed(y),
		},
		position: {
			x: windowWidth / 2,
			y: windowHeight / 2,
		},
		radius: windowWidth / 50,
	});
}