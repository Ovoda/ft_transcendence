import { Exclude } from "class-transformer";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { e_roomType } from "../types/room.type";
import { ChatroleEntity } from "./chatrole.entity";

@Entity()
export class ChatroomEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: true})
	lastmessage: string; // uuid of the last message, needs to be updated each time a message is send in this room

	@Column()
	room_type: e_roomType;

    @Exclude()
	password: string; // TO BE ENCRYPTED. (DECORATOR ?)

	@OneToMany(()=> ChatroleEntity, role => role.chatroom)
	@JoinTable()
	users: ChatroleEntity[];
}
