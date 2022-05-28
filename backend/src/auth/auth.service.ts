import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async ftLogin(user: any) {
        if (!user) {
            return "No such 42 user";
        }

        return {
            message: "User infos from 42",
            user: user,
        }
    }
}
