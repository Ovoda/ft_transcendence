import { Request } from "express";
import { UserEntity } from "src/user/entities/user.entity";

export interface JwtRequest extends Request {
    user: UserEntity;
}