import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { Repository } from "typeorm";
import { ChatMessageEntity } from "../entities/chatMessage.entity";

@Injectable()
export class ChatMessageService extends CrudService<ChatMessageEntity>{
	constructor(
		@InjectRepository(ChatMessageEntity)
		protected readonly _repository: Repository<ChatMessageEntity>,
		protected readonly _log: Logger,
	){
		super(_repository, _log);
	}	
}
