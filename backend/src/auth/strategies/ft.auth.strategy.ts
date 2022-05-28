import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { UserService } from "src/user/user.service";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, "user-ft") {
    constructor() {
        super({
            clientID: "4e16351ea15fbcc347c924b88e116d13722b6424abfe6464cb3b78f3b5c42d71",
            clientSecret: "3d0fa05ae72ad9d8b1c5a215671559d5c81489d25c4797bf69ef9d96636edcfe",
            callbackURL: "http://127.0.0.1:3001/auth/42/callback",
            scopt: "public",
        })
    }

    public validate(accessToken: string, refreshToken: string, profile: any) {
        console.log(accessToken);
        console.log(refreshToken);

        const user = {
            id: profile._json.id,
            email: profile._json.email,
            login: profile._json.login,
        };

        console.log(user);

        return user;
    }
}