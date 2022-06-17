import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatModule } from "src/chat/chat.module";
import { ChatGroupEntity } from "src/chat/entities/chatGroup.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { WebsocketsModule } from "src/websockets/websockets.module";
import { ImagesEntity } from "./entities/images.entity";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

// https://gabrieltanner.org/blog/nestjs-file-uploading-using-multer

@Module({
	imports:
		[TypeOrmModule.forFeature([ImagesEntity, UserEntity, ChatGroupEntity]),
		MulterModule.register({
			dest: './uploads',
		}),
			UserModule,
			ChatModule,
			ConfigModule,
			WebsocketsModule,
		],
	providers: [ImagesService, Logger],
	controllers: [ImagesController],
	exports: [ImagesService],
})
export class ImagesModule { }