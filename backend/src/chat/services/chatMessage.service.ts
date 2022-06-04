import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { Repository } from "typeorm";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
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

	async getManyMessagesFromId(messageId: string, limit: number) {
		let messages: ChatMessageEntity[] = [];
		let message = await this.findOneById(messageId);
		messages.push(message);
		if (!message.prev_message){
			return messages;
		} else {
			for (let i = 0; i < limit; i++){
				if (!message.prev_message){
					break ;
				}
				let tmp = await this.findOneById(message.prev_message);
				messages.push(tmp);
				message = tmp;
			}
		}
		return messages;
	}

	async postMessage(dto: CreateChatMessageDto){
		return await this.save({
			message: dto.message,
			userId: dto.userId,
			prev_message: dto.prevMessage ? dto.prevMessage : null,
		});
	}
}
