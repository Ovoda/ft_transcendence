import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EnableTfaDto {
	@IsNotEmpty()
    tfaCode: string;
}