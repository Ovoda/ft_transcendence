import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoleService } from 'src/chat/services/chatRole.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { SocketGateway } from 'src/websockets/socket.gateway';
import { GameEntity } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './services/game.service'

@Module({
	imports: [TypeOrmModule.forFeature([GameEntity]), UserModule],
	providers: [GameService, Logger],
	controllers: [GameController],
	exports: [TypeOrmModule, GameService],
})
export class GameModule { }
