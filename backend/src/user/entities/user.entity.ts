import { Exclude } from "class-transformer";
import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRelationsEntity } from "./userRelations.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    login: string;

    @Column()
    avatar: string;

    @Column({ nullable: true })
    @Exclude()
    tfaSecret?: string;

    @Column({ default: false })
    tfaEnabled: boolean;

	// @ManyToMany(()=> ChatEntity, chatroom => chatroom.users)
	// @JoinTable()
	// chatroom: ChatEntity[];

	@ManyToMany(() => UserRelationsEntity , relations => relations.users, {nullable: true})
	relations: UserRelationsEntity[];

	@OneToMany(()=> ChatRoleEntity, role => role.user, {eager: true})
	roles: ChatRoleEntity[];
}
