import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { WebsocketsService } from './websockets.service';

@Module({
  providers: [WebsocketsService, SocketGateway]
})
export class WebsocketsModule { }
