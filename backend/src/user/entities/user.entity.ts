import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ChatEntity } from "src/chat/entities/chat.entity";

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

	@ManyToMany(()=> ChatEntity, chatroom => chatroom.users)
	@JoinTable()
	chatroom: ChatEntity[];
}
