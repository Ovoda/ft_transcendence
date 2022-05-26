import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { GameGateway } from './game/game.gateway';

@Module({
	imports: [
		TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
	],
	controllers: [AppController],
	providers: [AppService, GameGateway],
})
export class AppModule { }
