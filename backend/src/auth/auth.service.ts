import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/createUser.dto';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: CreateUserDto) {

        const entity = await this.userService.findOrCreate(user);

        const payload: JwtPayload = { id: entity.id };

        const accessToken = this.jwtService.sign(payload);

        return ({ access_token: accessToken });
    }
}
