import { Exclude } from "class-transformer";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomTypeEnum } from "../types/room.type";
import { ChatRoleEntity } from "./chatRole.entity";

@Entity()
export class ChatRoomEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	lastMessage: string; // uuid of the last message, needs to be updated each time a message is send in this room

	@Column()
	room_type: RoomTypeEnum;

	@Exclude()
	password: string;

	@OneToMany(() => ChatRoleEntity, role => role.chatroom)
	@JoinTable()
	users: ChatRoleEntity[];
}
