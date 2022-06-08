import { IsNotEmpty } from "class-validator";
import { RelationTypeEnum } from "../enums/relationType.enum";


export default class UpdateRelationDto {

    @IsNotEmpty()
    relationId: string;

    @IsNotEmpty()
    status: RelationTypeEnum;
}