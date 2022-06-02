import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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



}
