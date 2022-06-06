import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Not, Repository } from "typeorm";
import { ChangeRoleDto } from "../dto/changeRole.dto";
import { CreateChatDto } from "../dto/createChat.dto";
import { CreateChatMessageDto } from "../dto/createChatMessage.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { OwnerError } from "../exceptions/ownerError.exception";
import { UserUnauthorized } from "../exceptions/userUnauthorized.exception";
import { e_roleType } from "../types/role.type";
import { e_roomType } from "../types/room.type";
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
	 * @param dto CreateChatDto
	 * @returns array of created roles.
	 */
	public async createRoles(dto: CreateChatDto) {
		let roles: ChatRoleEntity[] = [];
		for (let i = 0; i < dto.logins.length; i++) {
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
		for (let i = 0; i < dto.logins.length; i++) {
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
		// Faire ici le ban !
		if (role.role === e_roleType.BANNED) {
			throw new UserUnauthorized("User is banned from this room");
			// return null;
		}
		const room = await this.chatRoomService.findOneById(role.chatroom.id);
		let otherName: string;
		if (room.room_type === e_roomType.DM) {
			const currentUsr = await this.userService.findOneById(user_id);
			const othrole = await this.findOne({ where: [{ chatroom: room.id }, { user: Not(currentUsr) }] });
			if (role.user.id === user_id) {
				otherName = othrole.user.login;
			} else {
				otherName = role.user.login;
			}
		}
		let obj = {
			roomName: (room.name) ? room.name : otherName,
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
			// return null;
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
		console.log("userId", user_id);
		console.log("roleId", role_id);
		console.log("create message dto", createMessageChatDto);
		const role = await this.findOneById(role_id);
		if (user_id !== role.user.id) {
			throw new UserUnauthorized("this user cannot post message to this room");
		}
		if (role.role === e_roleType.MUTE) {
			throw new UserUnauthorized("User is muted on this room");
			//return null;
		}
		const message = await this.chatMessageService.postMessage(createMessageChatDto);
		const chatroom = role.chatroom;
		message.prev_message = (role.chatroom.lastmessage) ? role.chatroom.lastmessage : null;
		await this.chatRoomService.updateLastMessage(chatroom.id, message.id);
		return chatroom;
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
				chatroom: await this.chatRoomService.findOneById(changeRoleDto.chatroom_id),
				user: await this.userService.findOne({ where: { id: user_id } }),
			}
		});
		// console.log(callerRole);
		const roleModified = await this.findOne({
			where: {
				chatroom: await this.chatRoomService.findOneById(changeRoleDto.chatroom_id),
				user: await this.userService.findOne({ where: { login: changeRoleDto.login } }),
			}
		})
		// console.log(roleModified);
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
			&& roleModified.role !== e_roleType.ADMIN
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
}