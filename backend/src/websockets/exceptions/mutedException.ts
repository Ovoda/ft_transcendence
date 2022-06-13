import { ForbiddenException } from "@nestjs/common";

export default class MutedException extends ForbiddenException {
    constructor(infos?: string) {
        super("User is muted", infos);
    }
}