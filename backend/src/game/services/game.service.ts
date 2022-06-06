import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateGameDto } from "../dto/createGame.dto";
import { GameEntity } from "../entities/game.entity";
import { GameGateway } from "../gateways/game.gateway";

@Injectable()
export class GameService extends CrudService<GameEntity>{
	constructor(
		@InjectRepository(GameEntity)
		protected readonly _repository: Repository<GameEntity>,
		protected readonly userService: UserService,

		@Inject(forwardRef(() => GameGateway))
		protected readonly gameGateway: GameGateway,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	async saveNewGame(dto: CreateGameDto) {
		const user1 = await this.userService.findOneById(dto.user1);
		const user2 = await this.userService.findOneById(dto.user2);
		const game = await this.save({
			score1: dto.score1,
			score2: dto.score2,
			winner: dto.winner,
			looser: (dto.user1 === dto.winner) ? dto.user2 : dto.user1,
			users: [user1, user2],
		})
		if (!user1.games) {
			user1.games = [game];
		} else {
			user1.games.push(game);
		}
		if (!user2.games) {
			user2.games = [game];
		} else {
			user2.games.push(game);
		}
		const newuser1 = await this.userService.save(user1);
		const newuser2 = await this.userService.save(user2);
		return game;
	}
}