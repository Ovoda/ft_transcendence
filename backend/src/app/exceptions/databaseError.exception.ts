import { BadRequestException } from "@nestjs/common";

export class DatabaseErrorException extends BadRequestException {
    constructor(info: string) {
        super("Database error", info);
    }
}