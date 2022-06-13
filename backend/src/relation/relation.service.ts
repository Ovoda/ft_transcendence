import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/app/templates/crud.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import CreateRelationDto from './dtos/createRelation.dto';
import RelationEntity from './entities/relation.entity';
import { RelationTypeEnum } from './enums/relationType.enum';
import redondantRelationException from './exceptions/redondantRelation.exception';
import selfRelationException from './exceptions/selfRelation.exception';

@Injectable()
export class RelationService extends CrudService<RelationEntity>{
    constructor(
        @InjectRepository(RelationEntity)
        protected readonly _repository: Repository<RelationEntity>,
        protected readonly _logger: Logger,
        private readonly userService: UserService,
    ) {
        super(_repository, _logger);
    }

    /**
     * Creates a relation between two users, friends of blocked
     * @param createRelationDto - users and relation informations
     * @param currentUser - current user entity
     * @returns the newly created relation entity
     */
    async createRelation(createRelationDto: CreateRelationDto, currentUserId: string) {
        if (createRelationDto.userId === currentUserId) {
            throw new selfRelationException();
        }

        const currentUser = await this.userService.findOneById(currentUserId, {
            relations: ["relations"],
        });

        currentUser.relations.find((relation: RelationEntity) => {
            if (createRelationDto.userId === this.getCounterPart(relation.users, currentUser.id).id) {
                throw new redondantRelationException();
            }
        })

        const counterPart = await this.userService.findOneById(createRelationDto.userId);

        const newRelation = await this._repository.save({
            status: createRelationDto.status,
            users: [currentUser, counterPart],
            lastMessage: null,
        });

        return { ...newRelation, counterPart: this.getCounterPart(newRelation.users, currentUser.id) };
    }

    /**
     * Get user that is not current user in an array of user
     * @param users - users array of size 2
     * @param currentUserId - current user's ID
     * @returns counter part of user from the user array
     */
    getCounterPart(users: UserEntity[], currentUserId: string) {
        if (users[0].id === currentUserId) {
            return users[1];
        }
        return users[0];

    }

    /**
     * Get current user's relations with it's counterpart
     * @param currentUserId
     * @returns All relation with additional counter parg
     */
    async getAllRelations(currentUserId: string) {
        const user = await this.userService.findOneById(currentUserId, {
            relations: ["relations"],
        });

        return user.relations.map((relation: RelationEntity) => {
            return { ...relation, counterPart: this.getCounterPart(relation.users, currentUserId) };
        });
    }

    async getRelation(relationId: string, currentUserId: string) {
        const relation = await this.findOneById(relationId, {
            relations: ["users"],
        });

        return { ...relation, counterPart: this.getCounterPart(relation.users, currentUserId) }
    }

	async getRelationFromTwoUsers(userId1: string, userId2: string) {
		const relation1 = await this._repository
		.createQueryBuilder("relation")
        .select("relation")
        .innerJoin("relation.users", "user", "user.id = :id", {id: userId1})
        .getMany();

		const relation2 = await this._repository
		.createQueryBuilder("relation")
        .select("relation")
        .innerJoin("relation.users", "user", "user.id = :id", {id: userId2})
        .getMany();

		let relation: RelationEntity;
		for (let i = 0; i < relation1.length; i++){
			for (let j = 0; j < relation2.length; j++) {
				if (relation1[i].id === relation2[j].id){
					relation = relation1[i];
				}
			}
		}
		return relation;
	}
}
