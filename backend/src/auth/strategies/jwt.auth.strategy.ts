import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configService } from "src/app/config/config.service";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { InvalidTokenException } from "../exceptions/InvalidToken.exception";
import { JwtPayload } from "../interfaces/jwtPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "user-jwt") {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJwtTokenSecret(),
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload) {
            throw new InvalidTokenException();
        }
        const user = await this.userService.findOneById(payload.id)
            .catch(() => {
                throw new InvalidTokenException("User not found");
            })
        return (user);
    }
}