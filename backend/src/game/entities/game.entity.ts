import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class GameEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	//@Column()
	//user1: string;

	//@Column()
	//user2: string;

	//@Column()
	//periode: number;

	@Column()
	winner: string;

	@Column()
	looser: string;

	@Column()
	score1: number;

	@Column()
	score2: number;

	@ManyToMany(() => UserEntity, user => user.roles, { nullable: true })
	users: UserEntity[];
}