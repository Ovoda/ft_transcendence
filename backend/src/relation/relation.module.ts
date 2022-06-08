import { forwardRef, Logger, Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import RelationEntity from './entities/relation.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { SocketGateway } from 'src/websockets/socket.gateway';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [TypeOrmModule.forFeature([RelationEntity, UserEntity]), UserModule, forwardRef(() => WebsocketsModule)],
  providers: [RelationService, Logger],
  controllers: [RelationController],
  exports: [RelationService],
})
export class RelationModule { }
