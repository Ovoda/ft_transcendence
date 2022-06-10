import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleTypeEnum } from "../types/role.type";
import { ChatMessageEntity } from "./chatMessage.entity";
import { ChatGroupEntity } from "./chatGroup.entity";

@Entity()
export class ChatRoleEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	expires?: Date;

	@Column()
	role: RoleTypeEnum;

	@ManyToOne(() => UserEntity, user => user.roles)
	user: UserEntity;

	@ManyToOne(() => ChatGroupEntity, { nullable: true, eager: true })
	chatGroup: ChatGroupEntity;
}