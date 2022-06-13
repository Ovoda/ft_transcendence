import { ForbiddenException } from "@nestjs/common";



export default class UserAlreadyInGroup extends ForbiddenException {
    constructor() {
        super("User is already part of the group");
    }
}