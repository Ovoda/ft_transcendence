import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ImagesEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	root: string;

	@Column()
	filename: string;
}