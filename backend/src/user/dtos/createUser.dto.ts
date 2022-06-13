import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
    login: string;

	@IsNotEmpty()
    avatar: string;
}