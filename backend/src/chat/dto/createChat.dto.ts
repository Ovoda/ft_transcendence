import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { e_roomType } from "../types/room.type";

export class CreateChatDto {
	@IsNotEmpty()
	userIds: string[];

	@IsNotEmpty()
	roomType: e_roomType;

	@IsOptional()
	password?: string;
}
