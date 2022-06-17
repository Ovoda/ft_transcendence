import { forwardRef, Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { GameModule } from 'src/game/game.module';
import { RelationModule } from 'src/relation/relation.module';
import { UserModule } from 'src/user/user.module';
import { SocketGateway } from './socket.gateway';
import { WebsocketsService } from './websockets.service';

@Module({
	imports: [
		forwardRef(() => ChatModule),
		forwardRef(() => RelationModule),
		forwardRef(() => UserModule),
		forwardRef(() => GameModule)],
	providers: [WebsocketsService, SocketGateway],
	exports: [SocketGateway],
})
export class WebsocketsModule { }
