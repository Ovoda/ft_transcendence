import { forwardRef, Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import RelationEntity from 'src/relation/entities/relation.entity';
import { RelationModule } from 'src/relation/relation.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RelationEntity]),
  forwardRef(() => RelationModule),
  forwardRef(() => WebsocketsModule)],
  providers: [UserService, Logger],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
