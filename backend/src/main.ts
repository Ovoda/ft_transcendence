import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	app.enableCors();

	app.use(cookieParser());
	await app.listen(3001);
}

bootstrap();