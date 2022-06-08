import { Body, Controller, Get, HttpCode, Query, Req, UseGuards } from '@nestjs/common';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtRequest } from 'src/auth/interfaces/jwtRequest.interface';
import { request } from 'http';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
	) { }

	@Get()
	@UseGuards(TfaGuard)
	async getCurrentUser(
		@Req() req: JwtRequest,
		@Query("relations") relations: string
	) {
		if (relations) {
			return await this.userService.findOneById(req.user.id, {
				relations: ["relations"],
			})
		}
		return req.user;
	}

	/** TODO: what ? */
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
	} s

	@Get("many")
	@HttpCode(200)
	@UseGuards(TfaGuard)
	async getAllUsers(
		@Query("limit") limit: number,
		@Query("page") page: number,
		@Req() request: JwtRequest,
	) {
		const users = await this.userService.findMany({
			limit: limit,
			page: page,
		});

		const userWithoutCurrent = users.items.filter((user: UserEntity) => user.id !== request.user.id);

		return userWithoutCurrent.map((user: UserEntity) => {
			if (user.id !== request.user.id) {
				return {
					id: user.id,
					login: user.login,
					avatar: user.avatar,
				}
			}
		});
	}
}
