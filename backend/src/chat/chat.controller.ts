import { Controller, Get, Post, Body, Patch, Param, UseGuards, HttpCode, Query, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { ChangeRoleDto } from './dto/changeRole.dto';
import { CreateGroupDto } from './dto/createGroup.dto';
import { CreateChatMessageDto } from './dto/createChatMessage.dto';
import { CreatePasswordDto } from './dto/createPassword.dto';
import { ChatMessageService } from './services/chatMessage.service';
import { ChatRoleService } from './services/chatRole.service';
import { ChatGroupService } from './services/chatGroup.service.ts';
import { TransferPasswordDto } from './dto/transferPassword.dto';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatGroupService: ChatGroupService,
		private readonly chatRoleService: ChatRoleService,
		private readonly chatMessageService: ChatMessageService,
	) { }

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@HttpCode(201)
	async createChat(@Body() dto: CreateGroupDto) {
		const roles = await this.chatRoleService.createRoles(dto);
		return await this.chatGroupService.createGroup(dto, roles);
	}

	@UseGuards(JwtAuthGuard)
	@Get('all/roles/')
	@HttpCode(200)
	async getAllRolesOfUser(@Request() req) {
		// RETURN AN ARRAY OF A ROLE OF GIVEN USER.
		return await this.chatRoleService.getAllRolesFromUserId(req.user.id);
	}

	// return true or false.
	@UseGuards(JwtAuthGuard)
	@Get('ispassword/group/:roleId')
	@HttpCode(200)
	async roleIdRequirePassword(@Request() req, @Param('roleId') roleId: string){
		return await this.chatRoleService.GroupFromRolePasswordProtected(req.user.id, roleId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('ispassword/:groupId')
	@HttpCode(200)
	async groupRequirePassword(@Request() req, @Param('groupId') groupId: string){
		return await this.chatGroupService.GroupPasswordProtected(groupId)
	}


	@UseGuards(JwtAuthGuard)
	@Post('group/:role_id')
	@HttpCode(201)
	async getRoomFromRole(@Request() req, @Param('role_id') role_id: string, @Body() dto?: TransferPasswordDto) {
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
		return await this.chatRoleService.getRoomFromRole(req.user.id, role_id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Post('message/:role_id')
	@HttpCode(201)
	async postMessage(
		@Request() req,
		@Body() createChatMessageDto: CreateChatMessageDto,
		@Param('role_id') role_id: string,
	) {
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
		return await this.chatRoleService.postMessageFromRole(req.user.id, role_id, createChatMessageDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('many/messages/group/:role_id/:message_id')
	@HttpCode(200)
	async getManyMessages(
		@Request() req,
		@Param('role_id') role_id: string,
		@Param('message_id') message_id: string,
		@Query('limit') limit: number,
	) {
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
		return await this.chatRoleService.getManyMessagesFromRole(req.user.id, role_id, message_id, limit);
	}

	@Get("many/message/dm/:message_id")
	@HttpCode(200)
	@UseGuards(TfaGuard)
	async getManyDmMessages(
		@Param("message_id") messageId: string,
		@Query("limit") limit: number,
	) {
		return await this.chatMessageService.getManyMessagesFromId(messageId, 10);
	}

	@UseGuards(JwtAuthGuard)
	@Post('change/group/role')
	@HttpCode(201)
	async changeRole(@Request() req, @Body() changeRoleDto: ChangeRoleDto) {
		return await this.chatRoleService.changeRole(req.user.id, changeRoleDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('add/group/:roomId/:userIdAdded')
	@HttpCode(200)
	async addUserToRoom(
		@Request() req, 
		@Param('roomId') roomId: string,
		@Param('userId') userIdAdded: string
	) {
		return await this.chatRoleService.addUserAndRole(req.user.id, roomId, userIdAdded);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('kick/group/:groupIs/:roleId')
	@HttpCode(200)
	async kickUserFromRoom(
		@Request() req,
		@Param('groupId') groupId: string,
		@Param('roleId') roleId: string,
	){
		return await this.chatRoleService.kickUserAndRole(req.user.id, groupId, roleId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('protect/:groupId/')
	@HttpCode(201)
	async addPasswordToRoom(@Request() req, @Param('groupId') groupId: string, @Body() createPass: CreatePasswordDto){
		return await this.chatGroupService.createPassword(req, groupId, createPass);
	}

	@UseGuards(JwtAuthGuard)
	@Get('roles/all/:groupId')
	@HttpCode(200)
	async getAllRolesFromGroup(
		@Request() req,
		@Param('groupId') groupId: string,
		) {
		return await this.chatGroupService.getAllRolesFromGroupId(req.user.id, groupId);
	}

}
