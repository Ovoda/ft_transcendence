import { Controller, Get, Query, Redirect, Request, Response, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FtAuthGuard } from "./guards/ft.auth.guard";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Get("/login/user")
    @UseGuards(FtAuthGuard)
    async login(@Request() req) { }

    @Get("auth/42/callback")
    @UseGuards(FtAuthGuard)
    @Redirect()
    ftCallback(@Request() req, @Response() res) {
        const { accessToken } = this.authService.login(req.user);
        res.cookie('jwt', accessToken);
        return req.user;
    }
}