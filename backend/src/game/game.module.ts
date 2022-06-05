import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { GameEntity } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameGateway } from './gateways/game.gateway';
import { GameService } from './services/game.service'

@Module({
	imports: [TypeOrmModule.forFeature([GameEntity]), UserModule],
	providers: [GameGateway, GameService, Logger],
	controllers: [GameController],
	exports: [TypeOrmModule, GameService, GameGateway],
})
export class GameModule { }
