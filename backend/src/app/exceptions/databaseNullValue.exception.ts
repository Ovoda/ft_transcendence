import { BadRequestException } from "@nestjs/common";

export class DatabaseNullValueException extends BadRequestException {
    constructor(info: string) {
        super("Database null value exception", info);
    }
}

