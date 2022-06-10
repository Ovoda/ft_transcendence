import { Controller, Get, HttpCode, Query, Req, UseGuards } from '@nestjs/common';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtRequest } from 'src/auth/interfaces/jwtRequest.interface';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
	) { }

	@Get()
	@UseGuards(TfaGuard)
	async getCurrentUser(
		@Req() req: JwtRequest,
	) {
		return req.user;
	}

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
			relations: ["roles"]
		});

		const userWithoutCurrent = users.items.filter((user: UserEntity) => user.id !== request.user.id);

		return userWithoutCurrent.map((user: UserEntity) => {
			if (user.id !== request.user.id) {
				return {
					id: user.id,
					login: user.login,
					avatar: user.avatar,
					roles: user.roles,
				}
			}
		});
	}
}
