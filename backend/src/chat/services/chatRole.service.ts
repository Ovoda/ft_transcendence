import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { ChangeRoleDto } from "../dtos/changeRole.dto";
import { CreateGroupDto } from "../dtos/createGroup.dto";
import { CreateChatMessageDto } from "../dtos/createChatMessage.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { OwnerError } from "../exceptions/ownerError.exception";
import { UserUnauthorized } from "../exceptions/userUnauthorized.exception";
import { RoleTypeEnum } from "../types/role.type";
import { ChatMessageService } from "./chatMessage.service";
import { ChatGroupService } from "./chatGroup.service.ts";
import { TransferPasswordDto } from "../dtos/transferPassword.dto";
import { WrongPassword } from "../exceptions/wrongPassword.exception";
import { ChatPasswordService } from "./chatPassword.service";
import { NotCurrentUserRole } from "../exceptions/notCurrentUserRole.exception";
import { WebsocketsService } from "src/websockets/websockets.service";
import { SocketGateway } from "src/websockets/socket.gateway";
import JoinGroupDto from "../dtos/joinGroupDto";
import * as _ from 'lodash';

@Injectable()
export class ChatRoleService extends CrudService<ChatRoleEntity>{
	constructor(
		@InjectRepository(ChatRoleEntity)
		protected readonly _repository: Repository<ChatRoleEntity>,
		protected readonly userService: UserService,
		@Inject(forwardRef(() => ChatGroupService))
		private readonly chatGroupService: ChatGroupService,
		private readonly chatMessageService: ChatMessageService,
		private readonly chatPasswordService: ChatPasswordService,
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway,
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
			if ((upldRole.role === RoleTypeEnum.MUTE || upldRole.role === RoleTypeEnum.BANNED) && upldRole.expires < date) {
				await this.updateById(upldRole.id, {
					role: RoleTypeEnum.LAMBDA,
					expires: null,
				});
			}
		}
	}

	/**
	 * Create all associated roles when chatGroup is created.
	 * @param dto CreateGroupDto
	 * @returns array of created roles.
	 */
	public async createRoles(dto: CreateGroupDto) {
		let roles: ChatRoleEntity[] = [];
		for (let i = 0; i < dto.ids.length; i++) {
			let role = await this.create({
				user: await this.userService.findOneById(dto.ids[i]),
				role: (i == 0) ? RoleTypeEnum.OWNER : RoleTypeEnum.LAMBDA,
			});
			roles.push(role);
		}
		for (let i = 0; i < dto.ids.length; i++) {
			await this.save(roles[i]);
		}
		return roles;
	}

	/**
	 * Create all associated roles when chatGroup is created.
	 * @param userId the user calling the route. Avoid random user to read messages.
	 * @param role_id the role trying to connect on the room.
	 * @returns chatGroup if given role is not banned, undefined either.
	 */
	async getRoomFromRole(userId: string, role_id: string, dto?: TransferPasswordDto) {
		const role = await this.findOneById(role_id, {
			relations: ["user"],
		});
		if (role.user.id !== userId) {
			throw new UserUnauthorized("this user cannot go to this room");
		}
		if (role.role === RoleTypeEnum.BANNED) {
			throw new UserUnauthorized("User is banned from this room");
		}
		const room = await this.chatGroupService.findOneById(role.chatGroup.id);
		if (room.password) {
			if (!dto || !(dto.password)) {
				throw new WrongPassword('password mendatory');
			} else if (!this.chatPasswordService.verifyPassword(dto.password, room.password)) {
				throw new WrongPassword('you are giving the wrong password');
			}
		}
		let obj = {
			roomName: room.name,
			chatGroup: room,
		}
		return obj;
	}

	/**
	 * get messages verifying the role and the userId match.
	 * @param userId the user calling the route. Avoid random user to read messages.
	 * @param role_id the role trying to get messages.
	 * @returns array of messages if given role is not banned, undefined either.
	 */
	async getManyMessagesFromRole(userId: string, role_id: string, message_id: string, limit: number, onScroll: boolean) {
		const role = await this.findOneById(role_id, {
			relations: ['user'],
		});
		if (userId !== role.user.id) {
			throw new UserUnauthorized("This user cannot read thoses messages.");
		}
		if (role.role === RoleTypeEnum.BANNED) {
			throw new UserUnauthorized("User is banned from this room");
		}
		return await this.chatMessageService.getManyMessagesFromId(userId, message_id, onScroll,limit);
	}

	/**
	 * create message verifying the role and the userId match.
	 * @param userId the user calling the route. Avoid random user to read messages.
	 * @param role_id the role trying to get messages.
	 * @param createMessageChatDto necessary paramaters to create ChatMessageEntity
	 * @returns returns the updated chatGroup.
	 */
	async postMessageFromRole(userId: string, role_id: string, createMessageChatDto: CreateChatMessageDto) {
		const role = await this.findOneById(role_id, { relations: ['chatGroup', 'user'] });
		if (userId !== role.user.id) {
			throw new UserUnauthorized("this user cannot post message to this room");
		}
		if (role.role === RoleTypeEnum.MUTE) {
			throw new UserUnauthorized("User is muted on this room");
		}
		const message = await this.chatMessageService.postMessage(role.user.id, createMessageChatDto);
		const prev = (role.chatGroup.lastMessage) ? role.chatGroup.lastMessage : null;
		await this.chatMessageService.updateById(message.id, {
			prev_message: prev,
		})
		return await this.chatGroupService.updateLastMessage(role.chatGroup.id, message.id);
	}

	/**
	 * changing role by current user of a giver user identified by his login. Checking all rights in new role.
	 * @param userId the user calling the route. Avoid random user to read messages.
	 * @param changeRoleDto the data we need to change a role.
	 * @returns returns the modified role..
	 */
	async changeRole(userId: string, changeRoleDto: ChangeRoleDto) {
		if (changeRoleDto.newRole === RoleTypeEnum.OWNER) {
			throw new OwnerError("Owner is set at the chat group creation and cannot be changed.");
		}

		const callerRole = await this.findOne({
			where: {
				chatGroup: await this.chatGroupService.findOneById(changeRoleDto.groupId),
				user: await this.userService.findOne({ where: { id: userId } }),
			}
		});

		const userToChange = await this.userService.findOneById(changeRoleDto.userId)

		if (userId === userToChange.id
			|| callerRole.role === RoleTypeEnum.LAMBDA
			|| callerRole.role === RoleTypeEnum.MUTE
			|| callerRole.role === RoleTypeEnum.BANNED) {
			throw new UserUnauthorized("You cannot change role");
		}

		const roleToModify = await this.findOne({
			where: {
				chatGroup: await this.chatGroupService.findOneById(changeRoleDto.groupId),
				user: userToChange,
			}
		})

		if ((callerRole.role !== RoleTypeEnum.OWNER && callerRole.role !== RoleTypeEnum.ADMIN)
			|| roleToModify.role === RoleTypeEnum.OWNER)
			throw new UserUnauthorized("Unexpected change.");

		const modifiedRole = await this.updateById(roleToModify.id, {
			role: changeRoleDto.newRole,
			expires: (changeRoleDto.expires) ? changeRoleDto.expires : null,
		})

		this.socketGateway.updateRoles(
			changeRoleDto.newRole,
			modifiedRole.chatGroup.name,
			changeRoleDto.userId);

		return modifiedRole;
	}

	async addUserAndRole(caller: UserEntity, roomId: string, userIdAdded: string) {
		const callerRole: ChatRoleEntity = await this.findOne({ where: { user: caller } });

		if (callerRole.role !== RoleTypeEnum.OWNER && callerRole.role !== RoleTypeEnum.ADMIN) {
			throw new UserUnauthorized("You are not admin or owner of this chat group");
		}

		const newUser = await this.userService.findOneById(userIdAdded);
		const chatGroup = await this.chatGroupService.findOneById(roomId, { relations: ['users'] });

		const newRole = await this.save({
			expires: null,
			role: RoleTypeEnum.LAMBDA,
			user: newUser,
			chatGroup: chatGroup,
		})

		chatGroup.users.push(newRole);

		return await this.chatGroupService.save(chatGroup);
	}

	async kickUserAndRole(userIdCaller: string, roomId: string, KickRoleId: string) {

		/** Get caller entity and role entity */
		const chatGroup = await this.chatGroupService.findOneById(roomId, { relations: ['users'] });
		const callerRole = chatGroup.users.find((role: ChatRoleEntity) => role.user.id === userIdCaller);

		/** Check if caller is authorized to kick */
		if (callerRole.role !== RoleTypeEnum.OWNER
			&& callerRole.role !== RoleTypeEnum.ADMIN
			&& callerRole.id !== KickRoleId) {
			throw new UserUnauthorized("You are not admin or owner of this chat group");
		}

		/** Remove role from group's user list and datatase(!!) */
		_.remove(chatGroup.users, { id: KickRoleId });
		await this.delete(KickRoleId);

		/** Save new group entity */
		await this.chatGroupService.save(chatGroup);

		/** Emit event to client */
		this.socketGateway.updateRoles(RoleTypeEnum.BANNED, chatGroup.name, userIdCaller);
	}

	async getAllRolesFromUserId(userId: string) {
		return (await this.findMany({ where: { user: userId } })).items;
	}

	async getRole(roleId: string, currentUserId: string) {

		const currentUserRoles = await this.getAllRolesFromUserId(currentUserId);
		const role = currentUserRoles.find((role: ChatRoleEntity) => {
			return (role.id === roleId);
		});

		if (!role) {
			throw new NotCurrentUserRole();
		}

		return await this.findOneById(roleId, {
			relations: ["chatGroup", "user"],
		});
	}

	async GroupFromRolePasswordProtected(userId: string, roleId: string) {
		const rl = await this.findOneById(roleId, { relations: ['user'] });
		if (userId != rl.user.id) {
			throw new UserUnauthorized("user and role don't match");
		}
		const group = await this.chatGroupService.findOne({ where: { role: rl } });
		return (group.password) ? true : false;
	}

	async isBanned(roleId: string) {
		const role = await this.findOneById(roleId);
		return (role.role === RoleTypeEnum.BANNED) ? true : false;
	}

	async isMuted(roleId: string) {
		const role = await this.findOneById(roleId);
		return (role.role === RoleTypeEnum.MUTE) ? true : false;
	}
}