import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/createUser.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: CreateUserDto) {
        const entity = await this.userService.findOrCreate(user);
        return await this.getJwtAccessToken(entity.id);
    }

    async getJwtAccessToken(userID: string, isTfa: boolean = false) {
        const payload: JwtPayload = { id: userID, isTfa };
        const accessToken = this.jwtService.sign(payload);
        return ({ access_token: accessToken });
    }

    async generateTfaSecret(user: UserEntity): Promise<{ secret: string, otpAuthUrl: string }> {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(user.id, "Transcendance", secret);
        await this.userService.setTfaSecret(secret, user.id);
        return ({
            secret,
            otpAuthUrl,
        })
    }

    async pipQrCodeStream(stream: Response, otpAuthUrl: string) {
        return toFileStream(stream, otpAuthUrl);
    }

    async checkTfaCodeValidity(tfaCode: string, user: UserEntity) {
        return authenticator.verify({
            token: tfaCode,
            secret: user?.tfaSecret
        });
    }

}
