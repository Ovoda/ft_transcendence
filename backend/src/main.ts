import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	app.enableCors();

	await app.listen(3001);
}

bootstrap();