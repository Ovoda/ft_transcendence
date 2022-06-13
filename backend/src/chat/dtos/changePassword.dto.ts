import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty()
	roleId: string;

	@IsNotEmpty()
	oldPassword: string;

	@IsNotEmpty()
	newPassword: string;
}