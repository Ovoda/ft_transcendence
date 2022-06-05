import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { SocketGateway } from './socket.gateway';
import { WebsocketsService } from './websockets.service';

@Module({
  providers: [WebsocketsService, SocketGateway],
  imports: [ChatModule],
})
export class WebsocketsModule { }
