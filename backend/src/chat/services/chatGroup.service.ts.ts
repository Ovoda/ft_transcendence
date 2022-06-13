import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { getRepository, Repository } from "typeorm";
import { ChangePasswordDto } from "../dtos/changePassword.dto";
import { CreateGroupDto } from "../dtos/createGroup.dto";
import { CreateChatMessageDto } from "../dtos/createChatMessage.dto";
import { CreatePasswordDto } from "../dtos/createPassword.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { ChatGroupEntity } from "../entities/chatGroup.entity";
import { noMessagesYet } from "../exceptions/noMessagesYet.exception";
import { UserUnauthorized } from "../exceptions/userUnauthorized.exception";
import { RoleTypeEnum } from "../types/role.type";
import { ChatMessageService } from "./chatMessage.service";
import { ChatPasswordService } from "./chatPassword.service";
import { ChatRoleService } from "./chatRole.service";
import { WrongPassword } from "../exceptions/wrongPassword.exception";
import { UserEntity } from "src/user/entities/user.entity";
import JoinGroupDto from "../dtos/joinGroupDto";
import UserAlreadyInGroup from "../exceptions/UserAlreadyInGroup.exception";
import { SocketGateway } from "src/websockets/socket.gateway";

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
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	async createGroup(dto: CreateGroupDto, roles: ChatRoleEntity[]) {

		const password = await this.chatPasswordService.encryptPassword(dto.password);
		console.log(password);

		const chat = await this.save({
			name: dto.name,
			users: roles,
			password,
		});

		for (let i = 0; i < roles.length; i++) {
			await this.chatRoleService.updateById(roles[i].id, {
				chatGroup: chat,
			});
			const user = await this.userService.findOneById(roles[i].user.id, {
				relations: ["roles"],
			});
			user.roles.push(roles[i]);
		}
		return chat;
	}


	async deleteGroup(groupId: string, roleId: string) {
		const chatGroup = await this.findOneById(groupId,);

		const roles = await this.chatRoleService.findMany({
			where: {
				chatGroup: chatGroup,
			}
		});

		const deleted = await Promise.all(roles.items.map(async (role: ChatRoleEntity) => {
			return await this.chatRoleService.delete(role.id);
		}));
		await this.delete(chatGroup.id);
		this.socketGateway.emitToSocketRoom(groupId, "UpdateUserRoles");

	}

	async joinGroup(currentUser: UserEntity, joinGroupDto: JoinGroupDto) {

		/** Check if user is already in the group */
		if (await this.checkUserInGroup(currentUser.id, joinGroupDto.groupId)) {
			throw new UserAlreadyInGroup();
		}

		/** Verify group password */
		const group = await this.findOneById(joinGroupDto.groupId, { relations: ["users"], });
		if (group.password && !await this.chatPasswordService.verifyPassword(
			joinGroupDto.password, group.password)) {
			throw new UnauthorizedException();
		}

		/** Create new group user role */
		const newRole = await this.chatRoleService.save({
			expires: null,
			role: RoleTypeEnum.LAMBDA,
			user: currentUser,
		});

		/** Add user/role to group */
		group.users.push(newRole);

		/** Save new group */
		const newGroup = await this.save(group);

		/** Emit event to refresh infos in user's frontend */
		this.socketGateway.updateRoles(newRole.role, newGroup.name, currentUser.id);

		/** Update and return new role */
		return await this.chatRoleService.updateById(newRole.id, {
			chatGroup: newGroup,
		});
	}

	async checkUserInGroup(userId: string, groupId: string) {
		const roles = await this.chatRoleService.getAllRolesFromUserId(userId);
		const group = roles.find((role: ChatRoleEntity) => role.chatGroup.id === groupId);
		if (group) return true;
		return false;
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

	async getChatGroupManyMessages(room_id: string, limit: number) {
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

	// async postChatGroupMessage(dto: CreateChatMessageDto, room_id: string) {
	// 	const room = await this.findOneById(room_id);
	// 	dto.prevMessage = room.lastMessage;
	// 	const message = await this.chatMessageService.postMessage(dto);
	// 	return await this.updateById(room_id, {
	// 		lastMessage: message.id,
	// 	})
	// }

	async createPassword(userId: string, roomId: string, createPassword: CreatePasswordDto) {
		const role = await this.chatRoleService.findOneById(createPassword.roleId, { relations: ['user'] });
		if (role.user.id !== userId || role.role !== RoleTypeEnum.OWNER) {
			throw new UserUnauthorized("This user cannot change password")
		}
		const room = await this.findOneById(roomId);
		room.password = await this.chatPasswordService.encryptPassword(createPassword.password);
		return await this.save(room);
	}

	async updatePassword(userId: string, roomId: string, changePassword: ChangePasswordDto) {
		const role = await this.chatRoleService.findOneById(changePassword.roleId, { relations: ['user'] });
		if (role.user.id !== userId || role.role !== RoleTypeEnum.OWNER) {
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

	async getAllRolesFromGroupId(userId: string, groupId: string) {
		const usr = await this.userService.findOneById(userId);
		const role = await this.chatRoleService.findOne({ where: { user: usr } });
		if (role.role === RoleTypeEnum.BANNED) {
			throw new UserUnauthorized("User is banned.")
		}
		const group = await this.findOneById(groupId);
		const roles = await this.chatRoleService.findMany({ where: { chatGroup: group } });
		return roles;
	}

	async groupPasswordProtected(groupId: string) {
		const groupe = await getRepository(ChatGroupEntity)
			.createQueryBuilder()
			.addSelect('password')
			.getOne()
		console.log("password: ", groupe.password);
		return (groupe.password) ? true : false;
	}
}