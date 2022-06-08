import { forwardRef, Logger, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoleEntity } from './entities/chatRole.entity';
import { ChatGroupEntity } from './entities/chatGroup.entity';
import { ChatRoleService } from './services/chatRole.service';
import { ChatMessageService } from './services/chatMessage.service';
import { ChatGroupService } from './services/chatGroup.service.ts';
import { ChatMessageEntity } from './entities/chatMessage.entity';
import { UserModule } from 'src/user/user.module';
import { ChatPasswordService } from './services/chatPassword.service';

@Module({
	imports: [TypeOrmModule.forFeature([ChatRoleEntity, ChatGroupEntity, ChatMessageEntity]), UserModule],
	providers: [ChatPasswordService, ChatGroupService, ChatRoleService, ChatMessageService, Logger],
	controllers: [ChatController],
	exports: [ChatGroupService, ChatRoleService, ChatMessageService],
})
export class ChatModule { }