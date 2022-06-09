import { Logger, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

// https://gabrieltanner.org/blog/nestjs-file-uploading-using-multer

@Module({
	imports: [MulterModule.register({
		dest: './uploads',
	  })],
	providers: [ImagesService, Logger],
	controllers: [ImagesController],
	exports: [ImagesService],
})
export class ImagesModule {}