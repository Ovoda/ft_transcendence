import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configService } from "src/app/config/config.service";
import { JwtPayload } from "../interfaces/jwtPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "user-jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJwtTokenSecret(),
        });
    }

    async validate(payload: JwtPayload) {
        return ({ id: payload.sub, username: payload.username });
    }
}