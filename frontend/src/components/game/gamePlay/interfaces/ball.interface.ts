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

export function setRandomBallSpeed() {

	let x: number = getRandomArbitrary(-0.5, 0.5);
	let y: number = getRandomArbitrary(-0.5, 0.5);

	x = getHighSpeed(x);
	y = getHighSpeed(y);

	return ([x, y]);
}

export function setInitalBallPosition(windowWidth: number, windowHeight: number) {
	return ([windowWidth / 2, windowHeight / 2])
}


export function setInitialBallRadius(windowWidth: number) {
	return (windowWidth / 50);
}
export function setInitialBallState(windowWidth: number, windowHeight: number) {

	let newVelocity: number[] = [3, 3];
	// let newVelocity: number[] = setRandomBallSpeed();
	let newPosition: number[] = setInitalBallPosition(windowWidth, windowHeight);
	let newRadius: number = setInitialBallRadius(windowWidth);

	return ({
		velocity: {
			x: newVelocity[0],
			y: newVelocity[1],
		},
		position: {
			x: newPosition[0],
			y: newPosition[1],
		},
		radius: newRadius,
	});
}