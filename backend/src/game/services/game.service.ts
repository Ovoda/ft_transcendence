import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { UpdateStatsDto } from "../dtos/updateStats.dto";
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

	async saveNewStats(dto: UpdateStatsDto) {

		const winner = await this.userService.findOneById(dto.winnerId);
		const loser = await this.userService.findOneById(dto.loserId);
		winner.victories = winner.victories + 1;
		loser.defeats = loser.defeats + 1;
		const uwin = await this.userService.save(winner);
		const uloss = await this.userService.save(loser);
		return [uwin, uloss];
	}
}