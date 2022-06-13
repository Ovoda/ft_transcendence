import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePasswordDto {
	@IsNotEmpty()
	roleId: string;

	@IsNotEmpty()
	password: string;
}