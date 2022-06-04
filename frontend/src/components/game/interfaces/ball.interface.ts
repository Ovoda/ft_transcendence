import Position from './position.interface'

interface Ball {
	radius: number;
	position: Position;
	velocity: Position;
}

export default Ball;

export function setInitialBallState(windowWidth: number, windowHeight: number) {
	return ({
		velocity: {
			x: 1,
			y: 1,
		},
		position: {
			x: windowWidth / 2,
			y: windowHeight / 2,
		},
		radius: windowWidth / 50,
	});
}