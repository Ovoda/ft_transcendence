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