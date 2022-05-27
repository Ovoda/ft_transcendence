import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GameModule } from '../game/game.module';
import { configService } from '../config/config.service';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
		GameModule,
		UserModule,
	],
	controllers: [AppController],
	exports: [TypeOrmModule],
})
export class AppModule { }
