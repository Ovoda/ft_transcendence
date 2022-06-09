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

	async saveNewStats(dto: CreateGameDto) {
		//const user1 = await this.userService.findOneById(dto.user1);
		//const user2 = await this.userService.findOneById(dto.user2);
		//await this.userService.updateById(user1, {});
		//await this.userService.updateById(user2);
	}
}