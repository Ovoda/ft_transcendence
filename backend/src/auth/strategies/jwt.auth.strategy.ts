import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configService } from "src/app/config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "user-jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJwtTokenSecret(),
        });
    }

    async validate(payload: any) {
        return ({ id: payload.sub, username: payload.username });
    }
}