import { forwardRef, Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ChatModule } from 'src/chat/chat.module';
import RelationEntity from 'src/relation/entities/relation.entity';
import { RelationModule } from 'src/relation/relation.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RelationEntity]),
  forwardRef(() => RelationModule)],
  providers: [UserService, Logger],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
