import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePasswordDto {
	@IsNotEmpty()
	@IsUUID()
	roleId: string;

	@IsNotEmpty()
	password: string;
}