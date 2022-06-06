import Position from './position.interface'

interface Player {
	position: Position;
	velocity: Position;
	score: number;
	login: string;
	side: string;
	width: number;
	height: number;
}

export default Player;


export function resetPlayerLeftPosition(windowWidth: number, windowHeight: number, score: number, login: string) {
	return ({
		score: score,
		side: 'left',
		width: windowWidth / 45,
		height: windowHeight / 3,
		login: login,
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

export function resetPlayerRightPosition(windowWidth: number, windowHeight: number, score: number, login: string) {
	return ({
		score: score,
		side: 'right',
		width: windowWidth / 45,
		height: windowHeight / 3,
		login: login,
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
		login: 'unknow',
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
		login: 'unknow',
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