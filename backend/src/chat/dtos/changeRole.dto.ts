import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Timestamp } from 'typeorm';
import { RoleTypeEnum } from '../types/role.type';

export class ChangeRoleDto {
	@IsNotEmpty()
	@IsUUID()
	groupId: string;

	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	newRole: RoleTypeEnum;

	@IsOptional()
	expires?: Date;
}