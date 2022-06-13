import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { configService } from "src/app/config/config.service";
import { CrudService } from "src/app/templates/crud.service";
import { UserUnauthorized } from "src/chat/exceptions/userUnauthorized.exception";
import { ChatGroupService } from "src/chat/services/chatGroup.service.ts";
import { ChatRoleService } from "src/chat/services/chatRole.service";
import { RoleTypeEnum } from "src/chat/types/role.type";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateImageDto } from "./dtos/createImage.dto";
import { ImagesEntity } from "./entities/images.entity";

@Injectable()
export class ImagesService extends CrudService<ImagesEntity>{
	constructor(
		@InjectRepository(ImagesEntity)
		protected readonly _repository: Repository<ImagesEntity>,
		private readonly userService: UserService,
		private readonly groupService: ChatGroupService,
		private readonly roleService: ChatRoleService,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	async saveImage(createImageDto: CreateImageDto){
		return await this.save(createImageDto);
	}

	async saveImageForUser(createImageDto: CreateImageDto, id: string, userId: string) {
		if (id !== userId) {
			throw new UserUnauthorized("You cannot change other role profile picture.");
		}
		const user = await this.userService.findOneById(userId);
		const image = await this.save(createImageDto);
		user.avatar = configService.getBackendUrl() + "images/id/" + image.id;
		await this.userService.save(user);
		return image;
	}

	async saveImageForGroup(createImageDto: CreateImageDto, id: string, groupId: string, roleId: string) {
		const role = await this.roleService.findOneById(roleId, {relations: ['user']});
		if (role.user.id !== id) {
			throw new UserUnauthorized("Not the right user.")
		}
		if (role.role !== RoleTypeEnum.OWNER && role.role !== RoleTypeEnum.ADMIN) {
			throw new UserUnauthorized("Cannot change profile picture of group.")
		}
		const group = await this.groupService.findOneById(groupId);
		const image = await this.save(createImageDto);
		group.groupAvatar = configService.getBackendUrl() + "images/id/" + image.id;
		await this.groupService.save(group);
		return image;
	}

	async getImage(imageId: string) {
		//console.log(configService.getBackendUrl() + "images/id/" + imageId);
		return await this.findOneById(imageId);
	}
}