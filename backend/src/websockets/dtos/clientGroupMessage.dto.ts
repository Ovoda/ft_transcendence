import { IsNotEmpty } from "class-validator";
import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import RelationEntity from "src/relation/entities/relation.entity";

export default class ClientGroupMessageDto {
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
	role: ChatRoleEntity;
}