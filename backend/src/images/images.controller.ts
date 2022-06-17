import { Controller, Get, Param, Post, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { TfaGuard } from "src/auth/guards/tfa.auth.guard";
import { JwtRequest } from "src/auth/interfaces/jwtRequest.interface";
import { ChatRoleEntity } from "src/chat/entities/chatRole.entity";
import { ChatRoleService } from "src/chat/services/chatRole.service";
import { SocketGateway } from "src/websockets/socket.gateway";
import { ImagesService } from "./images.service";
import { editFileName, imageFileFilter } from "./utils/fileUpload.utils";

@Controller('images')
export class ImagesController {
	constructor(
		private readonly imagesService: ImagesService,
		private readonly chatRoleService: ChatRoleService,
		private readonly socketGateway: SocketGateway,
	) { }

	@UseGuards(TfaGuard)
	@Post('/user/upload')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: editFileName,
			}),
			fileFilter: imageFileFilter,
		})
	)
	async uploadUserFile(
		@Request() req,
		@UploadedFile() file) {
		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};
		await this.imagesService.saveImageForUser({
			filename: file.filename,
			root: './uploads',
		}, req.user.id);
		return response;
	}

	@UseGuards(TfaGuard)
	@Post('/group/upload/:groupId')
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
		@Req() request: JwtRequest,
		@UploadedFile() file,
		@Param('groupId') groupId: string) {
		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};

		const roles = await this.chatRoleService.getAllRolesFromUserId(request.user.id);
		const role = roles.find((role: ChatRoleEntity) => role.chatGroup.id === groupId);

		if (!role) return;

		await this.imagesService.saveImageForGroup({
			filename: file.filename,
			root: './uploads',
		}, request.user.id, groupId, role.id);

		await this.socketGateway.updateGroupImage(role.chatGroup.id);
		return response;
	}

	@Get('id/:imageId')
	async getFileFromId(@Param('imageId') imageId, @Res() res) {
		const imdb = await this.imagesService.getImage(imageId);
		return res.sendFile(imdb.filename, { root: imdb.root })
	}
}