import { Exclude } from "class-transformer";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoleEntity } from "./chatRole.entity";

@Entity()
export class ChatGroupEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	lastMessage: string; // uuid of the last message, needs to be updated each time a message is send in this room

	@Exclude()
	password: string;

	@OneToMany(() => ChatRoleEntity, role => role.chatroom)
	@JoinTable()
	users: ChatRoleEntity[];
}
