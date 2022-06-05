import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateChatDto } from "../dto/createChat.dto";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { UserUnauthorized } from "../exceptions/userUnauthorized.exception";
import { e_roleType } from "../types/role.type";
import { ChatMessageService } from "./chatMessage.service";
import { ChatRoomService } from "./chatRoom.service";

@Injectable()
export class ChatRoleService extends CrudService<ChatRoleEntity>{
	constructor(
		@InjectRepository(ChatRoleEntity)
		protected readonly _repository: Repository<ChatRoleEntity>,
		protected readonly userService: UserService,
		@Inject(forwardRef(() => ChatRoomService))
		private readonly chatRoomService: ChatRoomService,
		private readonly chatMessageService: ChatMessageService,
		protected readonly _log: Logger,
	){
		super(_repository, _log);
	}	

	public async createRoles(dto: CreateChatDto){
		let roles: ChatRoleEntity[] = [];
		for (let i = 0; i < dto.logins.length; i++){
			let role = await this.create({
				user: await this.userService.findOne(
					{
						where: {
							login: dto.logins[i]
						}
					}),
				role: (i == 0) ? e_roleType.OWNER : e_roleType.LAMBDA,
			});
			roles.push(role);
		}
		for (let i = 0; i < dto.logins.length; i++){
			await this.save(roles[i]);
		}
		return roles;
	}

	async getRoomFromRole(user_id: string, role_id: string) {
		const role = await this.findOneById(role_id);
		if (role.user.id != user_id){
			throw new UserUnauthorized("this user cannot go to this room");
		}
		// Faire ici le ban !
		return await this.chatRoomService.findOneById(role.chatroom.id);
	}

	async getManyMessagesFromRole(user_id: string, role_id: string, message_id: string, limit: number) {
		const role = await this.findOneById(role_id);
		if (user_id != role.user.id){
			throw new UserUnauthorized("This user cannot read thoses messages.");
		}
		return await this.chatMessageService.getManyMessagesFromId(message_id, limit);
	}

	async postMessageFromRole(user_id: string, role_id: string, createMessageChatDto: CreateChatMessageDto) {
		const role = await this.findOneById(role_id);
		if (user_id != role.user.id){
			throw new UserUnauthorized("this user cannot post message to this room");
		}
		const message = await this.chatMessageService.postMessage(createMessageChatDto);
		const chatroom = role.chatroom;
		message.prev_message = (role.chatroom.lastmessage) ? role.chatroom.lastmessage : null;
		await this.chatRoomService.updateLastMessage(chatroom.id, message.id);
		return chatroom;
	}
}