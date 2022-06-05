import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query } from '@nestjs/common';
import { CreateGameDto } from './dto/createGame.dto';
import { UpdateGameDto } from './dto/updateGame.dto';
import { GameService } from './services/game.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('game')
export class GameController {
	constructor(
		private readonly gameService: GameService
	) { }

	@Get('all')
	@HttpCode(200)
	async getGames(
		@Query() limit: number,
		@Query() pages: number,
	) {
		return await this.gameService.findMany({
			limit: limit,
			page: pages
		});
	}

}
