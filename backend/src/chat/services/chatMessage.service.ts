import { forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { Repository } from "typeorm";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
import { ChatMessageEntity } from "../entities/chatMessage.entity";
import { ChatRoomService } from "./chatRoom.service";

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
		if (!message){
			return messages;
		}
		messages.push(message);
		let lim: number;
		if (!message.prev_message){
			return messages;
		} else {
			lim = (!limit) ? 10 : limit;
			for (let i = 0; i < lim; i++){
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

	/**
	 * Creates and saves a chat message instance in the database
	 * @param dto chat message data
	 * @returns created message entity
	 */
	async postMessage(dto: CreateChatMessageDto) {
		const newMessage = await this.save({
			message: dto.message,
			userId: dto.userId,
			prev_message: dto.prevMessage,
		});
		return newMessage;
	}
}
