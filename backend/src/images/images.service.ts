import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/app/templates/crud.service";
import { Repository } from "typeorm";
import { CreateImageDto } from "./dtos/createImage.dto";
import { ImagesEntity } from "./entities/images.entity";

@Injectable()
export class ImagesService extends CrudService<ImagesEntity>{
	constructor(
		@InjectRepository(ImagesEntity)
		protected readonly _repository: Repository<ImagesEntity>,
		protected readonly _log: Logger,
	) {
		super(_repository, _log);
	}

	async saveImage(createImageDto: CreateImageDto) {
		return await this.save(createImageDto);
	}

	async getImage(imageId: string) {
		return await this.findOneById(imageId);
	}
}