import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
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
		FileInterceptor('file', {
		  storage: diskStorage({
			destination: './uploads',
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
		await this.imagesService.saveImage({
			filename: file.filename,
			root: './uploads',
		});
		return response;
	  }

	//   @Get(':imgpath')
	//   seeUploadedFile(@Param('imgpath') image, @Res() res) {
	// 	return res.sendFile(image, { root: './uploads' });
	//   }

	  @Get('id/:imageId')
	  async getFileFromId(@Param('imageId') imageId, @Res() res) {
		  const imdb = await this.imagesService.getImage(imageId);
		  return res.sendFile(imdb.filename, {root: imdb.root})
	  }
}