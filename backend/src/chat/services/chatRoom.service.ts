import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { Repository } from "typeorm";
import { ChatRoomEntity } from "../entities/chatRoom.entity";

@Injectable()
export class ChatRoomService extends CrudService<ChatRoomEntity>{
	constructor(
		@InjectRepository(ChatRoomEntity)
		protected readonly _repository: Repository<ChatRoomEntity>,
		protected readonly _log: Logger,
	){
		super(_repository, _log);
	}
}