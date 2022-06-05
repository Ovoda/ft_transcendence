import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { domainToASCII } from "url";
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

	async saveNewGame(createGameDto: CreateGameDto) {
		const user1 = await this.userService.findOneById(createGameDto.user1);
		const user2 = await this.userService.findOneById(createGameDto.user2);
		console.log(user1, user2);
		const game = await this.create({
			score1: createGameDto.score1,
			score2: createGameDto.score2,
			winner: createGameDto.winner,
			looser: (createGameDto.user1 === createGameDto.winner) ? createGameDto.user2 : createGameDto.user1,
			users: [user1, user2],
		});
		const savedGame = await this.save(game);
		if (!user1.games) {
			user1.games = [savedGame];
		} else {
			user1.games.push(savedGame);
		}
		if (!user2.games) {
			user2.games = [savedGame];
		} else {
			user2.games.push(savedGame);
		}
		console.log(game);
		return savedGame;
	}
}