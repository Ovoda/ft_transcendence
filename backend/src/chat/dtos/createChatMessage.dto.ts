import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateChatMessageDto {
	@IsNotEmpty()
	content: string;

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	avatar: string;

	@IsOptional()
	imageId?: string;

	@IsOptional()
	@IsUUID()
	prevMessage?: string;

	@IsNotEmpty()
	date: string;

	@IsOptional()
	password?: string;

}