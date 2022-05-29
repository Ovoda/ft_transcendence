import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { e_roomType } from "../types/room.type";
import { ChatEntity } from "./chat.entity";

@Entity()
export class RoleEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: true})
	role:  // uuid of the last message, needs to be updated each time a message is send in this room

	@OneToOne(()=> UserEntity)
	users: UserEntity;

	@OneToOne(()=> ChatEntity)
	chatroom: ChatEntity;
}