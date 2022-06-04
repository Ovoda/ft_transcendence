import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, "user-ft") {
    constructor() {
        super({
            clientID: "4e16351ea15fbcc347c924b88e116d13722b6424abfe6464cb3b78f3b5c42d71",
            clientSecret: "3d0fa05ae72ad9d8b1c5a215671559d5c81489d25c4797bf69ef9d96636edcfe",
            callbackURL: process.env.BACKEND_URL + "/auth/42/callback",
            scope: "public",
        })
    }

    public validate(accessToken: string, refreshToken: string, profile: any) {
        const user = {
            login: profile._json.login,
            avatar: profile._json.image_url,
        };

        return user;
    }
}