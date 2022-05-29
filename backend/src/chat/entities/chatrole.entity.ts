import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { e_roleType } from "../types/role.type";
import { ChatRoomEntity } from "./chatRoom.entity";

@Entity()
export class ChatRoleEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: true})
	role: e_roleType;

	@ManyToOne(()=> UserEntity, user => user.roles)
	user: UserEntity;

	@ManyToOne(()=> ChatRoomEntity)
	chatroom: ChatRoomEntity;
}