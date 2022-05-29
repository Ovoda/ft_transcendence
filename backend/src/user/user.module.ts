import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRelationsEntity } from './entities/userRelations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRelationsEntity])],
  providers: [UserService, Logger],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
