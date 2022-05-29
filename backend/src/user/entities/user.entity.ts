import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
