import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoleEntity } from "./chatRole.entity";

@Entity()
export class ChatMessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	userId: string;

	@Column()
	message: string;

	@Column({nullable: true})
	prev_message: string;
}