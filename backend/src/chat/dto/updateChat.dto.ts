import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { e_roleType } from '../types/role.type';
import { CreateChatDto } from './createChat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsNotEmpty()
	userIds: string[];

	@IsNotEmpty()
	roles: e_roleType[];
}
