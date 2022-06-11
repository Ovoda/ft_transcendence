import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateGroupDto {
	@IsNotEmpty()
	ids: string[];

	@IsNotEmpty()
	name: string;

	@IsOptional()
	password?: string;
}
