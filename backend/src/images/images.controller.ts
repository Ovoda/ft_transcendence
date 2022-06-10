import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ExpressAdapter, FileInterceptor } from "@nestjs/platform-express";
import fs from 'fs';
import multer, { diskStorage } from "multer";
import path from "path";

@Controller('images')
export class ImagesController {
	constructor() {}

	// @UseInterceptors(FileInterceptor('file', {
		// 	storage:{
			// 	destination(req, file, cb) {
				// 			cb(null, './uploads/')
				// 	},
				// 	filename(req, file, cb) {
					// 	  cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
					// 	}
					// }
					// }))
	@Post('upload')
	//@UseInterceptors('file')
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		
		const response = {
			originalname: file.originalname,
			filename: file.filename + '.png',
		};
		return response
	}
}