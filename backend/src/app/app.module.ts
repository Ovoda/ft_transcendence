import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GameModule } from '../game/game.module';
import { configService } from './config/config.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
		GameModule,
		UserModule,
		AuthModule,
		WebsocketsModule,
	],
	controllers: [AppController],
	exports: [TypeOrmModule],
})
export class AppModule { }
