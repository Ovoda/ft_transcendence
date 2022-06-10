import { Controller, Get, Param, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { TfaGuard } from "src/auth/guards/tfa.auth.guard";
import { ChatGroupService } from "src/chat/services/chatGroup.service.ts";
import { UserService } from "src/user/user.service";
import { ImagesService } from "./images.service";
import { editFileName, imageFileFilter } from "./utils/fileUpload.utils";

@Controller('images')
export class ImagesController {
	constructor(
		private readonly imagesService: ImagesService,
	) { }

	  @UseGuards(TfaGuard)
	  @Post('/user/upload/:userId')
	  @UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: editFileName,
			}),
			fileFilter: imageFileFilter,
		}),
	  )
	  async uploadUserFile(
		  	@Request() req,
			@UploadedFile() file,
	  		@Param('userId') userId: string,
		) {
		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};
		await this.imagesService.saveImageForUser({
			filename: file.filename,
			root: './uploads',
		}, req.user.id, userId);
		return response;
	  }

	  @UseGuards(TfaGuard)
	  @Post('/group/upload/:groupId/:roleId')
	  @UseInterceptors(
		FileInterceptor('file', {
		  storage: diskStorage({
			destination: './uploads',
			filename: editFileName,
		  }),
		  fileFilter: imageFileFilter,
		}),
	  )
	  async uploadGroupFile(
		  @Request() req,
		  @UploadedFile() file,
		  @Param('groupId') groupId: string,
		  @Param('roleId') roleId: string
		) {
		const response = {
		  originalname: file.originalname,
		  filename: file.filename,
		};
		await this.imagesService.saveImageForGroup({
			filename: file.filename,
			root: './uploads',
		}, req.user.id, groupId, roleId);
		
		return response;
	}

	//   @Get(':imgpath')
	//   seeUploadedFile(@Param('imgpath') image, @Res() res) {
	// 	return res.sendFile(image, { root: './uploads' });
	//   }

	// @Get('id/:imageId')
	// async getFileFromId(@Param('imageId') imageId, @Res() res) {
	// 	const imdb = await this.imagesService.getImage(imageId);
	// 	return res.sendFile(imdb.filename, { root: imdb.root })
	// }
	@Post('/upload')
	@UseInterceptors(
	  FileInterceptor('file', {
		storage: diskStorage({
		  destination: './uploads',
		  filename: editFileName,
		}),
		fileFilter: imageFileFilter,
	  }),
	)
	async uploadFile(
		@UploadedFile() file,
	  ) {
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

	  @Get('id/:imageId')
	  async getFileFromId(@Param('imageId') imageId, @Res() res) {
		  const imdb = await this.imagesService.getImage(imageId);
		  return res.sendFile(imdb.filename, {root: imdb.root})
	  }


}