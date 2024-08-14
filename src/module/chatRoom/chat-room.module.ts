import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoomCmsController } from './chat-room-cms.controller';
import { ChatRoomAppController } from './chat-room-app.controller';

@Module({
	imports: [],
	controllers: [ChatRoomAppController, ChatRoomCmsController],
	providers: [ChatRoomService, ChatRoomRepository],
	exports: [ChatRoomService, ChatRoomRepository],
})
export class ChatRoomModule {}
