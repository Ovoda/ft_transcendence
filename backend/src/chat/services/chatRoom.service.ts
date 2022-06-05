import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { throws } from "assert";
import { use } from "passport";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateChatDto } from "../dto/createChat.dto";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { ChatRoomEntity } from "../entities/chatRoom.entity";
import { noMessagesYet } from "../exceptions/noMessagesYet.exception";
import { e_roomType } from "../types/room.type";
import { ChatMessageService } from "./chatMessage.service";
import { ChatRoleService } from "./chatRole.service";

@Injectable()
export class ChatRoomService extends CrudService<ChatRoomEntity>{
	constructor(
		@InjectRepository(ChatRoomEntity)
		protected readonly _repository: Repository<ChatRoomEntity>,
		@Inject(forwardRef(() => ChatRoleService))
		private readonly chatRoleService: ChatRoleService,
		private readonly chatMessageService: ChatMessageService,
		private readonly userService: UserService,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	async createChat(dto: CreateChatDto, roles: ChatRoleEntity[]) {
		const chat = await this.save({
			room_type: dto.roomType,
			name: dto.name,
			users: roles,
		})
		for (let i = 0; i < roles.length; i++) {
			const role = await this.chatRoleService.updateById(roles[i].id, {
				chatroom: chat,
			});
			const user = await this.userService.findOneById(roles[i].user.id);
			user.roles.push(roles[i]);
		}
		return chat;
	}

	async checkLastMessage(room_id: string) {
		const chat = await this.findOneById(room_id);
		let last: string;
		if (chat.lastmessage) {
			last = chat.lastmessage;
		}
		return last;
	}

	async updateLastMessage(room_id: string, message: string) {
		const chat = await this.updateById(room_id, {
			lastmessage: message,
		})
		return chat;
	}

	async getChatRoomManyMessages(room_id: string, limit: number) {
		const lastMessageId = await this.checkLastMessage(room_id);
		if (!lastMessageId) {
			throw new noMessagesYet("No message in chat room yet.");
		}
		const messages = await this.chatMessageService.getManyMessagesFromId(lastMessageId, limit);
		const obj = {
			prev_message: messages[messages.length - 1].prev_message,
			messages: messages,
		}
		return obj;
	}

	async postChatRoomMessage(dto: CreateChatMessageDto, room_id: string) {
		const room = await this.findOneById(room_id);
		dto.prevMessage = room.lastmessage;
		const message = await this.chatMessageService.postMessage(dto);
		return await this.updateById(room_id, {
			lastmessage: message.id,
		})
	}
}