import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { e_userRelations } from "../types/userRelations.type";
import { UserEntity } from "./user.entity";

@Entity()
export class UserRelationsEntity{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	status: e_userRelations;

	@Column()
	created_at: string;

	@Column({nullable: true})
	updated_at: string;

	@ManyToMany(()=> UserEntity, user => user.relations)
	users: UserEntity[];
}