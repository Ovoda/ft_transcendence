import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import 'dotenv/config';
import { ChatEntity } from "src/chat/entities/chatroom.entity";
import { MessageEntity } from "src/chat/entities/message.entity";
import { RoleEntity } from "src/chat/entities/chatrole.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { UserRelationsEntity } from "src/user/entities/userRelations.entity";

export class ConfigService {

    private database_entities;

    constructor() {
        this.ensureValues(
            [
                "POSTGRES_HOST",
                "POSTGRES_PORT",
                "POSTGRES_DB",
                "POSTGRES_USER",
                "POSTGRES_PASSWORD",
                "JWT_SECRET"
            ]
        )
        this.database_entities = [
			UserEntity,
			UserRelationsEntity,
			RoleEntity,
			ChatEntity,
			MessageEntity,
		]
    }

    private ensureValues(keys: string[]) {
        keys.forEach((key) => this.getValue(key));
        return this;
    }

    private getValue(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Error ${key} is missing in your environment`);
        }
        return value;
    }

    public getJwtTokenSecret() {
        return this.getValue("JWT_SECRET");
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return ({
            type: 'postgres',

            host: this.getValue("POSTGRES_HOST"),
            port: parseInt(this.getValue("POSTGRES_PORT")),

            database: this.getValue("POSTGRES_DB"),
            username: this.getValue("POSTGRES_USER"),
            password: this.getValue("POSTGRES_PASSWORD"),

            entities: this.database_entities,
            synchronize: true,
        });
    }
}

export const configService = new ConfigService();