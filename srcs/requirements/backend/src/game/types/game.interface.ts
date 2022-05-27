export class Game {
	id: string;
	status: boolean;
	player1: string;
	player2: string;
}

export class Games {
	size: number;
	rooms: Game[];
}