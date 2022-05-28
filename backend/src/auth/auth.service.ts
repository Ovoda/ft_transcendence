import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }


    login(user: any): { accessToken: string } {
        const payload: JwtPayload = { username: user.username, sub: user.id };

        return ({
            accessToken: this.jwtService.sign(payload),
        });
    }
}
