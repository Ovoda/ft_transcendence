import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { configService } from '../config/config.service';
import { GameModule } from '../game/game.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
		GameModule
	],
	controllers: [AppController],
	exports: [TypeOrmModule],
})
export class AppModule { }
