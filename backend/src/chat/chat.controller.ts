import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
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
	  ) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@HttpCode(201)
	async createChat(@Body() dto: CreateChatDto){
		const roles = await this.chatRoleService.createRoles(dto);
		return await this.chatRoomService.createChat(dto, roles);
	}

	@UseGuards(JwtAuthGuard)
	@Get('room/:role_id')
	@HttpCode(201)
	async getRoomFromRole(@Request() req, @Param('role_id') role_id: string){
		return await this.chatRoleService.getRoomFromRole(req.user.id, role_id);
	}

	@UseGuards(JwtAuthGuard)
	@Post('message')
	@HttpCode(201)
	async postMessage(
		@Body() createChatMessageDto: CreateChatMessageDto
	){
		return await this.chatMessageService.postMessage(createChatMessageDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('many/messages/:role_id')
	@HttpCode(201)
	async getManyMessages(
		@Request() req,
		@Param('role_id') role_id: string,
		@Query('limit') limit: number,
	){
		return await this.chatRoleService.getManyMessagesFromRole(req.user.id, role_id, limit);
	}


}
