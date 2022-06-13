import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import RelationEntity from "src/relation/entities/relation.entity";

export default class ClientGroupMessageDto {
    content: string;
    username: string;
    avatar: string;
    userId: string;
    date: string;
    role: ChatRoleEntity;
} 