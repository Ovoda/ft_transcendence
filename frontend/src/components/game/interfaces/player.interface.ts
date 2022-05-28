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