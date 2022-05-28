import { UnauthorizedException } from "@nestjs/common";

export class InvalidTokenException extends UnauthorizedException {
    constructor(info?: string) {
        super("Invalid token", info);
    }
}