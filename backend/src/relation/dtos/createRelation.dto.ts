import { IsNotEmpty } from "class-validator";
import { RelationTypeEnum } from "../enums/relationType.enum";

/**
 * @class CreateRelationDto - data transfert object for relation creation
 * @field status - status of the relationship (blocked or friend)
 * @field userId - ids of the two users to link
 */
export default class CreateRelationDto {
    @IsNotEmpty()
    status: RelationTypeEnum;

    @IsNotEmpty()
    userId: string;
}