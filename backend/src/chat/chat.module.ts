import { forwardRef, Logger, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './entities/chatRoom.entity';
import { ChatRoleEntity } from './entities/chatRole.entity';
import { ChatRoleService } from './services/chatRole.service';
import { ChatMessageService } from './services/chatMessage.service';
import { ChatRoomService } from './services/chatRoom.service';
import { ChatMessageEntity } from './entities/chatMessage.entity';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([ChatRoomEntity, ChatRoleEntity, ChatMessageEntity]), UserModule],
	providers: [ChatRoomService, ChatRoleService, ChatMessageService, Logger],
	controllers: [ChatController],
	exports: [ChatRoomService, ChatRoleService, ChatMessageService],
})
export class ChatModule { }