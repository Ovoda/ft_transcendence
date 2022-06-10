import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Exclude } from "class-transformer";
import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import { GameEntity } from 'src/game/entities/game.entity';
import RelationEntity from 'src/relation/entities/relation.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserActivityStatusEnum } from '../enums/userConnectionStatus.enum';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	login: string;

	@Column()
	avatar: string;

	@Column({ nullable: true })
	imageId?: string;

	@Column({ nullable: true })
	@Exclude()
	tfaSecret?: string;

	@Column({ default: false })
	tfaEnabled: boolean;

	@Column({ default: UserActivityStatusEnum.DISCONNECTED })
	activityStatus: UserActivityStatusEnum;

	@Column({ default: 0 })
	victories: number;

	@Column({ default: 0 })
	defeats: number;

	@ManyToMany(() => RelationEntity, relations => relations.users, { nullable: true })
	relations: RelationEntity[];

	@OneToMany(() => ChatRoleEntity, role => role.user, { nullable: true })
	roles: ChatRoleEntity[];
}
