import { ForbiddenException } from "@nestjs/common";


export default class redondantRelationException extends ForbiddenException {
    constructor(infos?: string) {
        super("Relation already exists", infos);
    }
}