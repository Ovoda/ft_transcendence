import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from '../game/game.module';
import { configService } from './config/config.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { ChatModule } from 'src/chat/chat.module';
import { RelationModule } from 'src/relation/relation.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
		GameModule,
		UserModule,
		AuthModule,
		WebsocketsModule,
		ChatModule,
		RelationModule,
		ImagesModule,
	],
	exports: [TypeOrmModule],
})
export class AppModule { }
