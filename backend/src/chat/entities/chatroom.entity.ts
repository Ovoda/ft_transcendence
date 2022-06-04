import { Exclude } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { e_roomType } from "../types/room.type";
import { ChatRoleEntity } from "./chatRole.entity";

@Entity()
export class ChatRoomEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({nullable: true})
	lastmessage: string; // uuid of the last message, needs to be updated each time a message is send in this room

	@Column()
	room_type: e_roomType;

    @Exclude()
	password: string; // TO BE ENCRYPTED. (DECORATOR ?)

	@OneToMany(()=> ChatRoleEntity, role => role.chatroom)
	@JoinTable()
	users: ChatRoleEntity[];
}
