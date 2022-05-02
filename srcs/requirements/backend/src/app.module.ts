import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
	ConfigModule.forRoot ({
        envFilePath: '../.env',
        isGlobal: true,
    }),
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: process.env.POSTGRES_HOST,
		port: parseInt(<string>process.env.POSTGRES_PORT),
		database: process.env.POSTGRES_DB,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		synchronize: true,
		entities: [],
	}),
	GameModule,
	ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
