import { Controller, Get, Post, Body, Patch, Param, UseGuards, HttpCode, Query, Request, Delete, Req } from '@nestjs/common';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { ChangeRoleDto } from './dtos/changeRole.dto';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { CreateChatMessageDto } from './dtos/createChatMessage.dto';
import { CreatePasswordDto } from './dtos/createPassword.dto';
import { ChatMessageService } from './services/chatMessage.service';
import { ChatRoleService } from './services/chatRole.service';
import { ChatGroupService } from './services/chatGroup.service.ts';
import { TransferPasswordDto } from './dtos/transferPassword.dto';
import { JwtRequest } from 'src/auth/interfaces/jwtRequest.interface';
import { SocketGateway } from 'src/websockets/socket.gateway';
import JoinGroupDto from './dtos/joinGroupDto';
import { forEach } from 'lodash';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatGroupService: ChatGroupService,
		private readonly chatRoleService: ChatRoleService,
		private readonly chatMessageService: ChatMessageService,
		private readonly socketGateway: SocketGateway,
	) { }

	@UseGuards(TfaGuard)
	@Get("group/find/:group_id")
	@HttpCode(200)
	async getGroup(
		@Param("group_id") groupId: string) {
		return await this.chatGroupService.findOneById(groupId, { relations: ["users"] });
	}

	@UseGuards(TfaGuard)
	@Delete("/group/:group_id/:role_id")
	@HttpCode(200)
	async deleteGroup(
		@Param("group_id") groupId: string,
		@Param("role_id") roleId: string) {
		return await this.chatGroupService.deleteGroup(groupId, roleId);
	}

	@UseGuards(TfaGuard)
	@Get("group/many")
	@HttpCode(200)
	async getGroups() {
		const groups = await this.chatGroupService.findMany({
			page: 1,
			limit: 1000,
			select: ['groupAvatar', 'id', 'lastMessage', 'name']
		});
		return groups.items;
	}

	@UseGuards(TfaGuard)
	@Post('group/create')
	@HttpCode(201)
	async createChat(@Body() dto: CreateGroupDto) {
		const roles = await this.chatRoleService.createRoles(dto);
		const newGroup = await this.chatGroupService.createGroup(dto, roles);
		this.socketGateway.addGroup(newGroup);
		return newGroup
	}

	@UseGuards(TfaGuard)
	@Get('all/roles')
	@HttpCode(200)
	async getAllRolesOfUser(@Request() req: JwtRequest) {
		return await this.chatRoleService.getAllRolesFromUserId(req.user.id);
	}

	@UseGuards(TfaGuard)
	@Get('role/:role_id')
	@HttpCode(200)
	async getRole(
		@Request() req: JwtRequest,
		@Param("role_id") roleId: string) {
		return await this.chatRoleService.getRole(roleId, req.user.id);
	}

	@UseGuards(TfaGuard)
	@Get('haspassword/role/:roleId')
	@HttpCode(200)
	async roleIdRequirePassword(@Request() req, @Param('roleId') roleId: string) {
		return await this.chatRoleService.GroupFromRolePasswordProtected(req.user.id, roleId);
	}

	@UseGuards(TfaGuard)
	@Get('/group/protected/:groupId')
	@HttpCode(200)
	async groupRequirePassword(@Request() req, @Param('groupId') groupId: string) {
		const tmp = await this.chatGroupService.groupPasswordProtected(groupId);
		return tmp;
	}


	@UseGuards(TfaGuard)
	@Post('group/:role_id')
	@HttpCode(201)
	async getRoomFromRole(@Request() req, @Param('role_id') role_id: string, @Body() dto?: TransferPasswordDto) {
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
		return await this.chatRoleService.getRoomFromRole(req.user.id, role_id, dto);
	}

	@UseGuards(TfaGuard)
	@Post('postmessage/:role_id')
	@HttpCode(201)
	async postMessage(
		@Request() req,
		@Body() createChatMessageDto: CreateChatMessageDto,
		@Param('role_id') role_id: string,
	) {
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
		return await this.chatRoleService.postMessageFromRole(req.user.id, role_id, createChatMessageDto);
	}

	@UseGuards(TfaGuard)
	@Get('many/message/group/:role_id/:message_id')
	@HttpCode(200)
	async getManyMessages(
		@Request() req,
		@Param('role_id') role_id: string,
		@Param('message_id') message_id: string,
		@Query('limit') limit: number,
		@Query('onScroll') onscroll: string,
	) {
		const onScroll: boolean = (onscroll) ? true : false;
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
		return await this.chatRoleService.getManyMessagesFromRole(req.user.id, role_id, message_id, limit, onScroll);
	}

	@Get("many/message/dm/:message_id")
	@HttpCode(200)
	@UseGuards(TfaGuard)
	async getManyDmMessages(
		@Request() req,
		@Param("message_id") messageId: string,
		@Query("limit") limit: number,
		@Query("onScroll") onscroll: string,
	) {
		const onScroll: boolean = (onscroll) ? true : false;
		return await this.chatMessageService.getManyMessagesFromId(req.user.id, messageId, onScroll, 20);
	}

	@UseGuards(TfaGuard)
	@Post('change/group/role')
	@HttpCode(201)
	async changeRole(@Request() req: JwtRequest, @Body() changeRoleDto: ChangeRoleDto) {
		return await this.chatRoleService.changeRole(req.user.id, changeRoleDto);
	}

	@UseGuards(TfaGuard)
	@Patch('add/group/:roomId/:userIdAdded')
	@HttpCode(200)
	async addUserToRoom(
		@Request() req,
		@Param('roomId') roomId: string,
		@Param('userId') userIdAdded: string
	) {
		return await this.chatRoleService.addUserAndRole(req.user, roomId, userIdAdded);
	}

	@UseGuards(TfaGuard)
	@Patch('/group/join')
	@HttpCode(200)
	async joinGroup(
		@Request() req,
		@Body() joinGroupDto: JoinGroupDto) {
		return await this.chatGroupService.joinGroup(req.user, joinGroupDto);
	}

	@UseGuards(TfaGuard)
	@Patch('/group/kick/:groupId/:roleId')
	@HttpCode(200)
	async kickUserFromRoom(
		@Request() req,
		@Param('groupId') groupId: string,
		@Param('roleId') roleId: string,
	) {
		return await this.chatRoleService.kickUserAndRole(req.user.id, groupId, roleId);
	}

	@UseGuards(TfaGuard)
	@Post('protect/:groupId/')
	@HttpCode(201)
	async addPasswordToRoom(@Request() req, @Param('groupId') groupId: string, @Body() createPass: CreatePasswordDto) {
		return await this.chatGroupService.createPassword(req, groupId, createPass);
	}

	@UseGuards(TfaGuard)
	@Get('roles/all/:groupId')
	@HttpCode(200)
	async getAllRolesFromGroup(
		@Request() req: JwtRequest,
		@Param('groupId') groupId: string,
	) {
		return await this.chatGroupService.getAllRolesFromGroupId(req.user.id, groupId);
	}


}
