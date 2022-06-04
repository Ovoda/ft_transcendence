import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateUserDto {
    login: string;
    avatar: string;
}