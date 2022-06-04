import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, "user-ft") {
    constructor() {
        super({
            clientID: process.env.FT_APP_CLIENT_ID,
            clientSecret: process.env.FT_APP_CLIENT_SECRET,
            callbackURL: process.env.FT_APP_CALLBACK_URL,
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