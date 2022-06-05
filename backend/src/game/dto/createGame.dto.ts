import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateGameDto {
	@IsNotEmpty()
	@IsUUID()
	user1: string;

	@IsNotEmpty()
	@IsUUID()
	user2: string;

	@IsNotEmpty()
	@IsNumber()
	score1: number;

	@IsNotEmpty()
	@IsNumber()
	score2: number;

	@IsNotEmpty()
	@IsUUID()
	winner: string;

	@IsOptional()
	watchers?: string[];
}