import Position from './position.interface'

interface Ball {
	radius: number;
	position: Position;
	velocity: Position;
}

export default Ball;