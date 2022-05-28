import { BadRequestException } from "@nestjs/common";

export class DatabaseDuplicateException extends BadRequestException {
    constructor(info: string) {
        super("Database duplicate exception", info);
    }
}