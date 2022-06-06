import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { e_roomType } from "../types/room.type";

export class CreateChatDto {
	@IsNotEmpty()
	logins: string[];

	@IsNotEmpty()
	roomType: e_roomType;

	@IsOptional()
	roomName?: string;

	@IsOptional()
	password?: string;
}
