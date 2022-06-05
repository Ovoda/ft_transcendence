import Position from './position.interface'

interface Player {
	position: Position;
	velocity: Position;
	score: number;
	side: string;
	width: number;
	height: number;
}

export default Player;


export function resetPlayerLeftPosition(windowWidth: number, windowHeight: number, score: number) {
	return ({
		score: score,
		side: 'left',
		width: windowWidth / 45,
		height: windowHeight / 3,
		position: {
			x: 0,
			y: (windowHeight / 2) - ((windowHeight / 3) / 2),
		},
		velocity: {
			x: 0,
			y: 2,
		}
	});
}

export function resetPlayerRightPosition(windowWidth: number, windowHeight: number, score: number) {
	return ({
		score: score,
		side: 'right',
		width: windowWidth / 45,
		height: windowHeight / 3,
		position: {
			x: windowWidth - (windowWidth / 45),
			y: (windowHeight / 2) - ((windowHeight / 3) / 2),
		},
		velocity: {
			x: 0,
			y: 2,
		}
	});
}

export function setInitialPlayerLeftState(windowWidth: number, windowHeight: number) {
	return ({
		score: 0,
		side: 'left',
		width: windowWidth / 45,
		height: windowHeight / 3,
		position: {
			x: 0,
			y: (windowHeight / 2) - ((windowHeight / 3) / 2),
		},
		velocity: {
			x: 0,
			y: 2,
		}
	});
}

export function setInitialPlayerRightState(windowWidth: number, windowHeight: number) {
	return ({
		score: 0,
		side: 'right',
		width: windowWidth / 45,
		height: windowHeight / 3,
		position: {
			x: windowWidth - (windowWidth / 45),
			y: (windowHeight / 2) - ((windowHeight / 3) / 2),
		},
		velocity: {
			x: 0,
			y: 2,
		}
	});
}