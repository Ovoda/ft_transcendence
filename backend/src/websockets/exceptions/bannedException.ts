import { ForbiddenException } from "@nestjs/common";

export default class BannedException extends ForbiddenException {
    constructor(infos?: string) {
        super("User is banned", infos);
    }
}