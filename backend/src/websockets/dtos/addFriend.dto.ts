import { IsNotEmpty } from "class-validator";
import RelationEntity from "src/relation/entities/relation.entity";

export default class AddFriendDto {
	@IsNotEmpty()
    relation: RelationEntity;
}