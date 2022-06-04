import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateChatDto } from './dto/createChat.dto';
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
	async getRoomFromRole(@Param('role_id') role_id: string){
		return await this.chatRoleService.getRoomFromRole(role_id);
	}

	@Post('message')
	@HttpCode(201)
	async postMessage(){

	}

	@Get('many/messages/:role_id')
	@HttpCode(201)
	async getManyMessages(@Param('role_id') role_id: string ){
		
	}


}
