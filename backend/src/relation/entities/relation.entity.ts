import { UserEntity } from "src/user/entities/user.entity";
import { RelationTypeEnum } from "../enums/relationType.enum";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class RelationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    status: RelationTypeEnum;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => UserEntity, user => user.relations, { nullable: true, eager: true })
    @JoinTable()
    users: UserEntity[];

    @Column({ nullable: true })
    lastMessage: string;
}