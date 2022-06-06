import { GameEntity } from "src/game/entities/game.entity";

export class UpdateUserGamesDto {
	readonly games: GameEntity[];
}