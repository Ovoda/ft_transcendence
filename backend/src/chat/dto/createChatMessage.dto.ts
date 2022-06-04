import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateChatMessageDto {
	@IsNotEmpty()
	message: string;

	@IsUUID()
	@IsNotEmpty()
	userId: string;

	@IsOptional()
	@IsUUID()
	prevMessage?: string;
}