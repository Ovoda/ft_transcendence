import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query, Request, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { RelationQueryBuilder } from 'typeorm';
import { ChangeRoleDto } from './dto/changeRole.dto';
import { CreateChatDto } from './dto/createChat.dto';
import { CreateChatMessageDto } from './dto/createChatMessage.dto';
import { ChatMessageService } from './services/chatMessage.service';
import { ChatRoleService } from './services/chatRole.service';
import { ChatRoomService } from './services/chatRoom.service';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatRoomService: ChatRoomService,
		private readonly chatRoleService: ChatRoleService,
		private readonly chatMessageService: ChatMessageService,
	) { }

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@HttpCode(201)
	async createChat(@Body() dto: CreateChatDto) {
		const roles = await this.chatRoleService.createRoles(dto);
		return await this.chatRoomService.createChat(dto, roles);
	}

	@UseGuards(JwtAuthGuard)
	@Get('room/:role_id')
	@HttpCode(200)
	async getRoomFromRole(@Request() req, @Param('role_id') role_id: string) {
		return await this.chatRoleService.getRoomFromRole(req.user.id, role_id);
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
	@Get('many/messages/:role_id/:message_id')
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
	@Post('change/role')
	@HttpCode(201)
	async changeRole(@Request() req, @Body() changeRoleDto: ChangeRoleDto) {
		return await this.chatRoleService.changeRole(req.user.id, changeRoleDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('add/:roomId/:userIdAdded')
	@HttpCode(200)
	async addUserToRoom(
		@Request() req, 
		@Param('roomId') roomId: string,
		@Param('userId') userIdAdded: string
	) {
		return await this.chatRoleService.addUserAndRole(req.user.id, roomId, userIdAdded);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('kick/:roomId/:roleId')
	@HttpCode(200)
	async kickUserFromRoom(
		@Request() req,
		@Param('roomId') roomId: string,
		@Param('roleId') roleId: string,
	){
		return await this.chatRoleService.kickUserAndRole(req.user.id, roomId, roleId);
	}
}
