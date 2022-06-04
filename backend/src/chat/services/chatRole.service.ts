import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateChatDto } from "../dto/createChat.dto";
import { ChatRoleEntity } from "../entities/chatRole.entity";
import { e_roleType } from "../types/role.type";

@Injectable()
export class ChatRoleService extends CrudService<ChatRoleEntity>{
	constructor(
		@InjectRepository(ChatRoleEntity)
		protected readonly _repository: Repository<ChatRoleEntity>,
		protected readonly userService: UserService,
		protected readonly _log: Logger,
	){
		super(_repository, _log);
	}	

	public async createRoles(dto: CreateChatDto){
		let roles: ChatRoleEntity[] = [];
		for (let i = 0; i < dto.userIds.length; i++){
			let role = await this.create({
				user: await this.userService.findOneById(dto.userIds[i]),
				role: (i == 0) ? e_roleType.OWNER : e_roleType.LAMBDA,
			});
			roles.push(role);
		}
		for (let i = 0; i < dto.userIds.length; i++){
			await this.save(roles[i]);
		}
		return roles;
	}

	async getRoomFromRole(room_id: string){
		
	}
}