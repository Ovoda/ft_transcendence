import { Controller, Get, HttpCode, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService
	) { }

	@Get()
	@UseGuards(TfaGuard)
	getCurrentUser(@Request() req) {
		return req.user;
	}

	@Get('all')
	@HttpCode(200)
	async getGames(
		@Query() limit: number,
		@Query() pages: number,
	) {
		return await this.userService.findMany({
			limit: limit,
			page: pages
		});
	}
}
