import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Timestamp } from 'typeorm';
import { e_roleType } from '../types/role.type';

export class ChangeRoleDto {
	@IsNotEmpty()
	@IsUUID()
	groupId: string;

	@IsNotEmpty()
	user_id: string;

	@IsNotEmpty()
	newRole: e_roleType;

	@IsOptional()
	expires?: Date;
}