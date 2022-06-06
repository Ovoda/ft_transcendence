import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatMessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	login: string;

	@Column()
	avatar: string;

	@Column()
	content: string;

	@Column()
	date: string;

	@Column({ nullable: true })
	prev_message: string;
}