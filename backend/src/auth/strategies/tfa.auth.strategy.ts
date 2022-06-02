import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configService } from "src/app/config/config.service";
import { UserService } from "src/user/user.service";
import { InvalidTokenException } from "../exceptions/InvalidToken.exception";
import { JwtPayload } from "../interfaces/jwtPayload.interface";

@Injectable()
export class TfaStrategy extends PassportStrategy(Strategy, "user-tfa") {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
        if (!user.tfaEnabled) {
            return user;
        }
        if (payload.isTfa) {
            return user;
        }
    }
}