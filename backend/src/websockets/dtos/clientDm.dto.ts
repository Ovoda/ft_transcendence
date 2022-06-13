import { IsNotEmpty } from "class-validator";
import RelationEntity from "src/relation/entities/relation.entity";

/**
 * @interface ClientDmDto
 * @field content: string - text content of the message
 * @field from: string - sender of the message
 * @field date: string - date of message creation
 * @field room: string - room ID where message should be sent
 */
export default class ClientDmDto {
	@IsNotEmpty()
    content: string;

	@IsNotEmpty()
    username: string;

	@IsNotEmpty()
    avatar: string;

	@IsNotEmpty()
    userId: string;

	@IsNotEmpty()
    date: string;

	@IsNotEmpty()
    relation: RelationEntity;
} 