import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { Repository } from "typeorm";
import { ChatRoleEntity } from "../entities/chatRole.entity";

@Injectable()
export class ChatRoleService extends CrudService<ChatRoleEntity>{
	constructor(
		@InjectRepository(ChatRoleEntity)
		protected readonly _repository: Repository<ChatRoleEntity>,
		protected readonly _log: Logger,
	){
		super(_repository, _log);
	}	
}