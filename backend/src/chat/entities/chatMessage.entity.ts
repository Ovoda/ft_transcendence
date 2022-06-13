import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatMessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	userId: string;

	@Column()
	content: string;

	@Column()
	date: string;

	@Column({ nullable: true })
	prev_message: string;
}