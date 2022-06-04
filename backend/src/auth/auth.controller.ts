import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { ConfigService } from "src/app/config/config.service";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { EnableTfaDto } from "./dtos/enableTFA.dto";
import { FtAuthGuard } from "./guards/ft.auth.guard";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";
import { TfaGuard } from "./guards/tfa.auth.guard";
import { JwtRequest } from "./interfaces/jwtRequest.interface";

@Controller("/auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Get("/user")
    @UseGuards(FtAuthGuard)
    async login(@Req() req) { }

    @Get("42/callback")
    @UseGuards(FtAuthGuard)
    async ftCallback(@Query("code") code: string, @Req() req: any, @Res() res: Response) {
        const authInfos = await this.authService.login(req.user);

        const cookie = `authentication=${authInfos.access_token}; HttpOnly; Path=/; Max-Age=15min`

        res.setHeader("Set-Cookie", cookie);

        const user = await this.userService.findOne({
            where: {
                login: req.user.login,
            }
        });

        let url = process.env.FRONTEND_URL;
        if (user.tfaEnabled) {
            url = process.env.FRONTEND_URL + "/tfa";
        }
        res.status(302).redirect(url);
    }

    @Get("tfa/generate")
    @UseGuards(JwtAuthGuard)
    async generateTfa(@Req() req: any, @Res() res: any) {
        const { otpAuthUrl } = await this.authService.generateTfaSecret(req.user);
        return this.authService.pipQrCodeStream(res, otpAuthUrl);
    }

    @Post("tfa/enable")
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async enableTfa(@Req() req: JwtRequest, @Body() body: EnableTfaDto) {
        const tfaCode = body.tfaCode;

        const codeIsValid = await this.authService.checkTfaCodeValidity(tfaCode, req.user);

        if (!codeIsValid) {
            throw new UnauthorizedException("Wrong authentication code");
        }
        return await this.userService.turnTfaOn(req.user.id);
    }

    @Get("tfa/disable")
    @HttpCode(200)
    @UseGuards(TfaGuard)
    async disableTfa(@Req() req: JwtRequest) {
        await this.userService.turnTfaOff(req.user.id);
    }

    @Post("tfa/authenticate")
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticateTfa(@Req() req: JwtRequest, @Body() body: EnableTfaDto, @Res() res: Response) {
        const tfaCode = body.tfaCode;

        const codeIsValid = await this.authService.checkTfaCodeValidity(tfaCode, req.user);

        if (!codeIsValid) {
            throw new UnauthorizedException("Wrong authentification code");
        }
        const { access_token } = await this.authService.getJwtAccessToken(req.user.id, true);

        const cookie = `authentication=${access_token}; HttpOnly; Path=/; Max-Age=15min`

        res.setHeader("Set-Cookie", cookie);
        res.send();
    }

    @Get("/logout")
    @UseGuards(TfaGuard)
    async logout(@Res() res: Response) {
        const cookie = `authentication=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        res.setHeader("Set-Cookie", cookie);
        res.send();
    }
}