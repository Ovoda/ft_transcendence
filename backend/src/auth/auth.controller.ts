import { Controller, Get, Query, Redirect, Request, UseGuards } from "@nestjs/common";
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

    @Redirect()
    @Get("auth/42/callback")
    @UseGuards(FtAuthGuard)
    async ftCallback(@Request() req) {
        return this.authService.ftLogin(req.user);
    }

}