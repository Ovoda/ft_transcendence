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
	) {
		super(_repository, _log);
	}

	/**
	 * Get limit or ten messages from the message id.
	 * @param messageId message id in db to goes from
	 * @param limit (optional) the number of message you want to get, 10 if optionnal
	 * @returns array of messages comming from the passing message id
	 */
	async getManyMessagesFromId(messageId: string, limit?: number) {
		let messages: ChatMessageEntity[] = [];
		let message = await this.findOneById(messageId);

		if (!message) {
			return messages;
		}
		messages.push(message);
		let lim: number;
		if (!message.prev_message) {
			return [];
		} else {
			lim = (!limit) ? 10 : limit;
			for (let i = 0; i < lim - 1; i++) {
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
