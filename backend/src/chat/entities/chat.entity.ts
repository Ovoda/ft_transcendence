import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { e_roomType } from "../types/room.type";

@Entity()
export class ChatEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: true})
	lastmessage: string; // uuid of the last message, needs to be updated each time a message is send in this room

	@Column()
	room_type: e_roomType;

	@ManyToMany(()=> UserEntity, user => user.chatroom)
	@JoinTable()
	users: UserEntity[];


}
