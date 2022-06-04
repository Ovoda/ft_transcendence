import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";
import { UserEntity } from "../entities/user.entity";
import { e_userRelations } from "../types/userRelations.type";

export class createUserRelationDto{
	@IsNotEmpty()
	status: e_userRelations;

	@IsNotEmpty()
	user1: UserEntity;

	@IsNotEmpty()
	user2: UserEntity;
}