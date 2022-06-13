import { Body, Controller, Get, HttpCode, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtRequest } from 'src/auth/interfaces/jwtRequest.interface';
import { RelationService } from 'src/relation/relation.service';
import { request } from 'http';
import UpdateUserDto from './dtos/updateUser.dto';
import { SocketGateway } from 'src/websockets/socket.gateway';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly socketGateway: SocketGateway,
	) { }

	@Get()
	@UseGuards(TfaGuard)
	async getCurrentUser(
		@Req() req: JwtRequest) {
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
			relations: ["roles", "relations"],
		});

		const userWithoutCurrent = users.items.filter((user: UserEntity) => user.id !== request.user.id);

		return userWithoutCurrent.map((user: UserEntity) => {
			return {
				id: user.id,
				login: user.login,
				username: user.username,
				avatar: user.avatar,
				roles: user.roles,
				relations: user.relations,
			}
		});
	}

	@Patch()
	@HttpCode(200)
	@UseGuards(TfaGuard)
	async updateUser(
		@Req() request: JwtRequest,
		@Body() updateUserDto: UpdateUserDto) {
		const newUser = await this.userService.updateById(request.user.id, updateUserDto);
		this.socketGateway.updateRelations();
		return newUser;
	}
}
