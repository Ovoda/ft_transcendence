import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { throws } from "assert";
import { use } from "passport";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { ChangePasswordDto } from "../dto/changePassword.dto";
import { CreateGroupDto } from "../dto/createGroup.dto";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
import { CreatePasswordDto } from "../dto/createPassword.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { ChatGroupEntity } from "../entities/chatGroup.entity";
import { noMessagesYet } from "../exceptions/noMessagesYet.exception";
import { UserUnauthorized } from "../exceptions/userUnauthorized.exception";
import { e_roleType } from "../types/role.type";
import { ChatMessageService } from "./chatMessage.service";
import { ChatPasswordService } from "./chatPassword.service";
import { ChatRoleService } from "./chatRole.service";
import { WrongPassword } from "../exceptions/wrongPassword.exception";

@Injectable()
export class ChatGroupService extends CrudService<ChatGroupEntity>{
	constructor(
		@InjectRepository(ChatGroupEntity)
		protected readonly _repository: Repository<ChatGroupEntity>,
		@Inject(forwardRef(() => ChatRoleService))
		private readonly chatRoleService: ChatRoleService,
		private readonly chatMessageService: ChatMessageService,
		private readonly chatPasswordService: ChatPasswordService,
		protected readonly userService: UserService,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	async createGroup(dto: CreateGroupDto, roles: ChatRoleEntity[]) {
		const chat = await this.save({
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
		if (chat.lastMessage) {
			last = chat.lastMessage;
		}
		return last;
	}

	async updateLastMessage(room_id: string, message: string) {
		const chat = await this.updateById(room_id, {
			lastMessage: message,
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
		dto.prevMessage = room.lastMessage;
		const message = await this.chatMessageService.postMessage(dto);
		return await this.updateById(room_id, {
			lastMessage: message.id,
		})
	}

	async createPassword(userId: string, roomId: string, createPassword: CreatePasswordDto) {
		const role = await this.chatRoleService.findOneById(createPassword.roleId, {relations: ['user']});
		if (role.user.id !== userId || role.role !== e_roleType.OWNER) {
			throw new UserUnauthorized("This user cannot change password")
		}
		const room = await this.findOneById(roomId);
		room.password = await this.chatPasswordService.encryptPassword(createPassword.password);
		return await this.save(room);
	}

	async updatePassword(userId: string, roomId: string, changePassword: ChangePasswordDto) {
		const role = await this.chatRoleService.findOneById(changePassword.roleId, {relations: ['user']});
		if (role.user.id !== userId || role.role !== e_roleType.OWNER) {
			throw new UserUnauthorized("This user cannot change password");
		}
		const room = await this.findOneById(roomId);
		if (!this.chatPasswordService.verifyPassword(changePassword.oldPassword, room.password)) {
			throw new WrongPassword('Old password is wrong');
		}
		room.password = await this.chatPasswordService.encryptPassword(changePassword.newPassword);
		const newGroup = await this.save(room);
		return newGroup;
	}

	async getAllRolesFromGroupId(userId: string, groupId: string){
		const usr = await this.userService.findOneById(userId);
		const role = await this.chatRoleService.findOne({where: {user: usr}});
		if (role.role === e_roleType.BANNED) {
			throw new UserUnauthorized("User is banned.")
		}
		const group = await this.findOneById(groupId);
		const roles = await this.chatRoleService.findMany({where: {chatroom: group}});
		return roles;
	}

	async GroupPasswordProtected(groupId: string) {
		const gp = await this.findOneById(groupId);
		return (gp.password) ? true : false;
	}
}