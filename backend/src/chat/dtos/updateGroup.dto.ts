import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { RoleTypeEnum } from '../types/role.type';
import { CreateGroupDto } from './createGroup.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
	@IsNotEmpty()
	userIds: string[];

	@IsNotEmpty()
	roles: RoleTypeEnum[];
}
