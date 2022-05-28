import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
    Strategy,
    "user-local")
{
    constructor(
        private readonly authService: AuthService,
    ) {
        super();
    }
}