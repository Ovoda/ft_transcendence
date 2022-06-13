import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import RelationEntity from "src/relation/entities/relation.entity";
import { RelationTypeEnum } from "src/relation/enums/relationType.enum";
import { RelationService } from "src/relation/relation.service";
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
		protected readonly relationService: RelationService,
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
			username: user.username,
			avatar: user.avatar,
			content: msg.content,
			date: msg.date,
			prev_message: msg.prev_message,
		}
		return message;
	}

	private filterBlockedMessages(blockedUserIds: string[], messageUserId: string) {
		return blockedUserIds.includes(messageUserId);
	}

	async getManyMessagesFromId(getterId: string, messageId: string, onScroll: boolean, limit?: number) {
		//let messages: ChatMessageEntity[] = [];
		let message = await this.findOneById(messageId);
		let msg = await this.buildMessageFromEntity(message);
		let messages: Message[] = [];

		if (!message) {
			return messages;
		}

		const user = await this.userService.findOneById(getterId, { relations: ["relations"] });

		const blockedRelations = user.relations.filter((relation: RelationEntity) => {
			relation.status === RelationTypeEnum.BLOCKED
		});

		const blockedUsers = blockedRelations.map((relation: RelationEntity) => {
			if (relation.users[0].id === getterId) {
				return relation.users[1].id;
			} else if (relation.users[1].id === getterId) {
				return relation.users[0].id;
			}
		});

		let valid = this.filterBlockedMessages(blockedUsers, message.userId);
		if (!valid) {
			messages.push(msg);
		}
		let lim: number;
		if (!msg.prev_message) {
			return messages;
		} else {
			lim = (!limit) ? 20 : limit;
			for (let i = 0; i < lim - 1;) {
				if (!msg.prev_message) break;

				let tmp = await this.findOneById(msg.prev_message);
				const tmpmsg = await this.buildMessageFromEntity(tmp);

				if (!this.filterBlockedMessages(blockedUsers, tmp.userId)) {
					i++;
					messages.push(tmpmsg);
				}
				msg = tmpmsg;
			}
		}
		return (onScroll && !messages[messages.length - 1].prev_message) ? [] : messages;
	}

	/**
	 * Creates and saves a chat message instance in the database
	 * @param dto chat message data
	 * @returns created message entity
	 */
	async postMessage(userId: string, dto: CreateChatMessageDto) {
		const newMessage = await this.save({
			content: dto.content,
			date: dto.date,
			prev_message: dto.prevMessage,
			userId: userId,
		});
		return newMessage;
	}
}
