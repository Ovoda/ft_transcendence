import { Module } from '@nestjs/common';
import { GameGateway } from './gateways/game.gateway';

@Module({
  providers: [GameGateway],
})
export class GameModule {}
