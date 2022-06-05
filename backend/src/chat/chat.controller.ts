import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
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
	async getRoomFromRole(@Request() req, @Param('role_id') role_id: string){
		// retourner un objet du type: 
		// {
		// 	room_name: si roomtype === DM -> userlogin != req.user.login sinon room.name,
		// 	room: getRoomFromRole
		// }
		await this.chatRoleService.uploadRoleFromExpiration(role_id);
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

	@UseGuards(JwtAuthGuard)
	@Post('change/role')
	@HttpCode(201)
	async changeRole(@Request() req, @Body() changeRoleDto: ChangeRoleDto){
		return await this.chatRoleService.changeRole(req.user.id, changeRoleDto);
	}
}
