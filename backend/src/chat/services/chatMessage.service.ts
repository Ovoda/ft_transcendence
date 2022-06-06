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
		// private readonly chatRoomService: ChatRoomService,
	) {
		super(_repository, _log);
	}

	async getManyMessagesFromId(messageId: string, limit: number) {
		let messages: ChatMessageEntity[] = [];
		let message = await this.findOneById(messageId);
		messages.push(message);
		if (!message.prev_message) {
			return messages;
		} else {
			for (let i = 0; i < limit; i++) {
				if (!message.prev_message) {
					break;
				}
				let tmp = await this.findOneById(message.prev_message);
				messages.push(tmp);
				message = tmp;
			}
		}
		return messages;
	}

	/**
	 * Creates and saves a chat message instance in the database
	 * @param dto chat message data
	 * @returns created message entity
	 */
	async postMessage(dto: CreateChatMessageDto) {
		const newMessage = await this.save({
			content: dto.content,
			login: dto.login,
			date: dto.date,
			prev_message: dto.prevMessage,
			avatar: dto.avatar,
		});
		return newMessage;
	}
}
