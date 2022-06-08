import { ForbiddenException } from "@nestjs/common";

export default class extends ForbiddenException {
    constructor(info?: string) {
        super("You canno't create a relation with yourself", info);
    }
}