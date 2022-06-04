import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class EnableTfaDto {
    tfaCode: string;
}