import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	message: string;

	@Column()
	prev_message: string;

	
}