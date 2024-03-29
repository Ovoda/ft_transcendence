import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import 'dotenv/config';
import { ChatGroupEntity } from "src/chat/entities/chatGroup.entity";
import { ChatMessageEntity } from "src/chat/entities/chatMessage.entity";
import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { GameEntity } from "src/game/entities/game.entity";
import RelationEntity from "src/relation/entities/relation.entity";
import { ImagesEntity } from "src/images/entities/images.entity";

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
				"JWT_SECRET",
				"BACKEND_URL",
			]
		)
		this.database_entities = [
			UserEntity,
			RelationEntity,
			ChatRoleEntity,
			ChatGroupEntity,
			ChatMessageEntity,
			GameEntity,
			ImagesEntity,
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

	public getBackendUrl(){
		return this.getValue("BACKEND_URL");
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

	public setupSwagger(app: INestApplication) {
		const config = new DocumentBuilder()
			.setTitle('Transcendance con los WOLFOS')
			.setDescription('Last 42\'s common core project')
			.setVersion('1.0')
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('api', app, document);
	}
}

export const configService = new ConfigService();