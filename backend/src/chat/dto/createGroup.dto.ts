import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { RoomTypeEnum } from "../types/room.type";

export class CreateGroupDto {
	@IsNotEmpty()
	ids: string[];

	@IsNotEmpty()
	roomType: RoomTypeEnum;

	@IsNotEmpty()
	name: string;

	@IsOptional()
	password?: string;
}
