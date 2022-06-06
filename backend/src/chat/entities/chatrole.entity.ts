import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { e_roleType } from "../types/role.type";
import { ChatMessageEntity } from "./chatMessage.entity";
import { ChatRoomEntity } from "./chatRoom.entity";

@Entity()
export class ChatRoleEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	//@Column()
	//login: string; // TO find role, maybe better.
	@Column({nullable: true})
	expires?: Date;

	@Column()
	role: e_roleType;

	@ManyToOne(() => UserEntity, user => user.roles)
	user: UserEntity;

	@ManyToOne(() => ChatRoomEntity, { nullable: true, eager: true })
	chatroom: ChatRoomEntity;
}