import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoleEntity } from "./chatRole.entity";

@Entity()
export class ChatGroupEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ default: "https://42.fr/wp-content/uploads/2021/08/42.jpg" })
	groupAvatar?: string;

	@Column({ nullable: true })
	lastMessage: string;

	@Column({ nullable: true })
	password?: string;

	@OneToMany(() => ChatRoleEntity, role => role.chatGroup)
	@JoinTable()
	users: ChatRoleEntity[];
}
