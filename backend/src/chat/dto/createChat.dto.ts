import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { RoomTypeEnum } from "../types/room.type";

export class CreateChatDto {
	@IsNotEmpty()
	logins: string[];

	@IsNotEmpty()
	roomType: RoomTypeEnum;

	@IsOptional()
	name?: string;

	@IsOptional()
	password?: string;
}
