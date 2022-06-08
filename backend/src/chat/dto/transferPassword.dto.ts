import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TransferPasswordDto {
	@IsOptional()
	password?: string;
}