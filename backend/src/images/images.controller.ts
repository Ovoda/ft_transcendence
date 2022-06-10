import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ImagesService } from "./images.service";
import { editFileName, imageFileFilter } from "./utils/fileUpload.utils";

@Controller('images')
export class ImagesController {
	constructor(
		private readonly imagesService: ImagesService,
	) {}

	  @Post('upload')
	  @UseInterceptors(
		FileInterceptor('image', {
		  storage: diskStorage({
			destination: './files',
			filename: editFileName,
		  }),
		  fileFilter: imageFileFilter,
		}),
	  )
	  async uploadedFile(@UploadedFile() file) {
		const response = {
		  originalname: file.originalname,
		  filename: file.filename,
		};
		return response;
	  }
}