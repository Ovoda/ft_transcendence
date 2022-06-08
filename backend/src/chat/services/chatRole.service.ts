import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { ChangeRoleDto } from "../dto/changeRole.dto";
import { CreateGroupDto } from "../dto/createGroup.dto";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { OwnerError } from "../exceptions/ownerError.exception";
import { UserUnauthorized } from "../exceptions/userUnauthorized.exception";
import { e_roleType } from "../types/role.type";
import { ChatMessageService } from "./chatMessage.service";
import { ChatGroupService } from "./chatGroup.service.ts";

@Injectable()
export class ChatRoleService extends CrudService<ChatRoleEntity>{
	constructor(
		@InjectRepository(ChatRoleEntity)
		protected readonly _repository: Repository<ChatRoleEntity>,
		protected readonly userService: UserService,
		@Inject(forwardRef(() => ChatGroupService))
		private readonly chatGroupService: ChatGroupService,
		private readonly chatMessageService: ChatMessageService,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	/**
	 * Setup automaticly role to LAMBDA if current date has passed expires in role entity
	 * @param role_id message id in db to goes from
	 * @returns nothing
	 */
	public async uploadRoleFromExpiration(role_id: string) {
		const date = new Date();
		const upldRole = await this.findOneById(role_id);
		if (upldRole.expires) {
			if ((upldRole.role === e_roleType.MUTE || upldRole.role === e_roleType.BANNED) && upldRole.expires < date) {
				await this.updateById(upldRole.id, {
					role: e_roleType.LAMBDA,
					expires: null,
				});
			}
		}
	}

	/**
	 * Create all associated roles when chatroom is created.
	 * @param dto CreateGroupDto
	 * @returns array of created roles.
	 */
	public async createRoles(dto: CreateGroupDto) {
		let roles: ChatRoleEntity[] = [];
		for (let i = 0; i < dto.ids.length; i++) {
			let role = await this.create({
				user: await this.userService.findOneById(dto.ids[i]),
				role: (i == 0) ? e_roleType.OWNER : e_roleType.LAMBDA,
			});
			roles.push(role);
		}
		for (let i = 0; i < dto.ids.length; i++) {
			await this.save(roles[i]);
		}
		return roles;
	}

	/**
	 * Create all associated roles when chatroom is created.
	 * @param user_id the user calling the route. Avoid random user to read messages.
	 * @param role_id the role trying to connect on the room.
	 * @returns chatroom if given role is not banned, undefined either.
	 */
	async getRoomFromRole(user_id: string, role_id: string) {
		const role = await this.findOneById(role_id, {
			relations: ["user"],
		});
		if (role.user.id !== user_id) {
			throw new UserUnauthorized("this user cannot go to this room");
		}
		if (role.role === e_roleType.BANNED) {
			throw new UserUnauthorized("User is banned from this room");
		}
		const room = await this.chatGroupService.findOneById(role.chatroom.id);
		let otherName: string;
		let obj = {
			roomName: room.name,
			chatRoom: room,
		}
		return obj;
	}

	/**
	 * get messages verifying the role and the user_id match.
	 * @param user_id the user calling the route. Avoid random user to read messages.
	 * @param role_id the role trying to get messages.
	 * @returns array of messages if given role is not banned, undefined either.
	 */
	async getManyMessagesFromRole(user_id: string, role_id: string, message_id: string, limit: number) {
		const role = await this.findOneById(role_id, {
			relations: ['user'],
		});
		if (user_id !== role.user.id) {
			throw new UserUnauthorized("This user cannot read thoses messages.");
		}
		if (role.role === e_roleType.BANNED) {
			throw new UserUnauthorized("User is banned from this room");
		}
		return await this.chatMessageService.getManyMessagesFromId(message_id, limit);
	}

	/**
	 * create message verifying the role and the user_id match.
	 * @param user_id the user calling the route. Avoid random user to read messages.
	 * @param role_id the role trying to get messages.
	 * @param createMessageChatDto necessary paramaters to create ChatMessageEntity
	 * @returns returns the updated chatroom.
	 */
	async postMessageFromRole(user_id: string, role_id: string, createMessageChatDto: CreateChatMessageDto) {
		const role = await this.findOneById(role_id, { relations: ['chatroom', 'user'] });
		if (user_id !== role.user.id) {
			throw new UserUnauthorized("this user cannot post message to this room");
		}
		if (role.role === e_roleType.MUTE) {
			throw new UserUnauthorized("User is muted on this room");
		}
		const message = await this.chatMessageService.postMessage(createMessageChatDto);
		const prev = (role.chatroom.lastMessage) ? role.chatroom.lastMessage : null;
		await this.chatMessageService.updateById(message.id, {
			prev_message: prev,
		})
		return await this.chatGroupService.updateLastMessage(role.chatroom.id, message.id);
	}

	/**
	 * changing role by current user of a giver user identified by his login. Checking all rights in new role.
	 * @param user_id the user calling the route. Avoid random user to read messages.
	 * @param changeRoleDto the data we need to change a role.
	 * @returns returns the modified role..
	 */
	async changeRole(user_id: string, changeRoleDto: ChangeRoleDto) {
		if (changeRoleDto.newRole === e_roleType.OWNER) {
			throw new OwnerError("Owner is set at the chatroom creation and cannot be changed.");
		}
		const callerRole = await this.findOne({
			where: {
				chatroom: await this.chatGroupService.findOneById(changeRoleDto.groupId),
				user: await this.userService.findOne({ where: { id: user_id } }),
			}
		});
		const roleModified = await this.findOne({
			where: {
				chatroom: await this.chatGroupService.findOneById(changeRoleDto.groupId),
				user: await this.userService.findOne({ where: { id: changeRoleDto.user_id } }),
			}
		})
		if (
			callerRole.role === e_roleType.LAMBDA
			|| callerRole.role === e_roleType.MUTE
			|| callerRole.role === e_roleType.BANNED
		) {
			throw new UserUnauthorized("You cannot change role");
		}
		if (
			callerRole.role === e_roleType.OWNER
		) {
			await this.updateById(roleModified.id, {
				role: changeRoleDto.newRole,
				expires: (changeRoleDto.expires) ? changeRoleDto.expires : null,
			});
		}
		else if (
			callerRole.role === e_roleType.ADMIN
			&& roleModified.role !== e_roleType.OWNER
			//&& roleModified.role !== e_roleType.ADMIN // ADMIN can change status of others admins.
		) {
			await this.updateById(roleModified.id, {
				role: changeRoleDto.newRole,
				expires: (changeRoleDto.expires) ? changeRoleDto.expires : null,
			});
		}
		else {
			throw new UserUnauthorized("Unexpected change.");
		}
		return roleModified;
	}

	async addUserAndRole(userIdCaller: string, roomId: string, userIdAdded: string){
		//const room = await this.findOneById(roomId, {relations: ['roles']});
		const caller = await this.userService.findOneById(userIdCaller);
		const callerRole: ChatRoleEntity = await this.findOne({where: {user: caller}});
		if (callerRole.role !== e_roleType.OWNER && callerRole.role !== e_roleType.ADMIN) {
			throw new UserUnauthorized("You are not admin or owner of this chatroom");
		}
		const newUser = await this.userService.findOneById(userIdAdded);
		const chatroom = await this.chatGroupService.findOneById(roomId, {relations: ['users']});
		const newRole = await this.save({
			expires: null,
			role: e_roleType.LAMBDA,
			user: newUser,
			chatroom: chatroom,
		})
		chatroom.users.push(newRole);
		return await this.chatGroupService.save(chatroom);
	}

	async kickUserAndRole(userIdCaller: string, roomId: string, KickRoleId: string) {
		const caller = await this.userService.findOneById(userIdCaller);
		const callerRole: ChatRoleEntity = await this.findOne({where: {user: caller}});
		if (callerRole.role !== e_roleType.OWNER && callerRole.role !== e_roleType.ADMIN) {
			throw new UserUnauthorized("You are not admin or owner of this chatroom");
		}
		const chatroom = await this.chatGroupService.findOneById(roomId, {relations: ['users']});
		let oldUsers = chatroom.users;
		let newUsers = [];
		for (let i = 0; i < oldUsers.length; i++) {
			if (KickRoleId !== oldUsers[i].id) {
				newUsers.push(oldUsers[i]);
			}
		}
		chatroom.users = newUsers;
		return await this.chatGroupService.save(chatroom);
	}

	async getAllRolesFromUserId(userId: string) {
		return await this.findMany({where: {user: userId}});
	}
}