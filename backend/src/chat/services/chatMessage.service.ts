import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateChatMessageDto } from "../dtos/createChatMessage.dto";
import { ChatMessageEntity } from "../entities/chatMessage.entity";
import { Message } from "../interfaces/message.interface";

@Injectable()
export class ChatMessageService extends CrudService<ChatMessageEntity>{
	constructor(
		@InjectRepository(ChatMessageEntity)
		protected readonly _repository: Repository<ChatMessageEntity>,
		protected readonly userService: UserService,
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
	async getManyMessagesFromIdv1(messageId: string, limit?: number) {
		let messages: ChatMessageEntity[] = [];
		let message = await this.findOneById(messageId);

		if (!message) {
			return messages;
		}
		messages.push(message);
		let lim: number;
		if (!message.prev_message) {
			return [message];
		} else {
			lim = (!limit) ? 20 : limit;
			for (let i = 0; i < lim; i++) {
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

	private async buildMessageFromEntity(msg: ChatMessageEntity) {
		const user = await this.userService.findOneById(msg.userId);
		const message: Message = {
			id: msg.id,
			login: user.login,
			avatar: user.avatar,
			content: msg.content,
			date: msg.date,
			prev_message: msg.prev_message,
		}
		return message;
	}

	async getManyMessagesFromId(messageId: string, limit?: number) {
		//let messages: ChatMessageEntity[] = [];
		let message = await this.findOneById(messageId);
		let msg = await this.buildMessageFromEntity(message);
		let messages: Message[] = [];

		if (!message) {
			return messages;
		}
		messages.push(msg);
		let lim: number;
		if (!msg.prev_message) {
			return messages;
		} else {
			lim = (!limit) ? 20 : limit;
			for (let i = 0; i < lim - 1; i++) {
				if (!msg.prev_message) {
					break;
				}
				let tmp = await this.findOneById(msg.prev_message);
				const tmpmsg = await this.buildMessageFromEntity(tmp);
				messages.push(tmpmsg);
				msg = tmpmsg;
			}
		}
		return messages;
	}

	/**
	 * Creates and saves a chat message instance in the database
	 * @param dto chat message data
	 * @returns created message entity
	 */
	async postMessage(userId: string, dto: CreateChatMessageDto) {
		const newMessage = await this.save({
			content: dto.content,
			//login: dto.login,
			date: dto.date,
			prev_message: dto.prevMessage,
			//avatar: dto.avatar,
			userId: userId,
		});
		return newMessage;
	}
}
