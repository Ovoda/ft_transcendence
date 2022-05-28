import { Controller, Get, Query, Req, Request, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { FtAuthGuard } from "./guards/ft.auth.guard";

@Controller("/auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Get("/user")
    @UseGuards(FtAuthGuard)
    async login(@Request() req) { }

    @Get("42/callback")
    @UseGuards(FtAuthGuard)
    async ftCallback(@Query("code") code: string, @Req() req: any, @Res() res: Response) {
        const accessToken = this.authService.login(req.user);
        res.cookie("access_token", (await accessToken).access_token);
        res.status(302).redirect("http://localhost:3000");
    }
}