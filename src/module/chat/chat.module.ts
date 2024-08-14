import { forwardRef, Module } from '@nestjs/common';
import { ChatCmsService } from './chat-cms.service';
import { ChatRepository } from './chat.repository';
import { ChatAppController } from './chat-app.controller';
import { ChatRoomModule } from '../chatRoom/chat-room.module';
import { UserModule } from '../user/user.module';
import { ChatCmsController } from './chat-cms.controller';
import { NetworkUserModule } from '../network/user/network-user.module';
import { MessageModule } from '../message/message.module';
import { ChatGatewayModule } from '../../gateway/chat/chat-gateway.module';
import { NetworkTiesModule } from '../network/ties/network-ties.module';
import { ChatAppService } from './chat-app.service';

@Module({
	imports: [
		ChatRoomModule,
		UserModule,
		NetworkUserModule,
		NetworkTiesModule,
		forwardRef(() => MessageModule),
		forwardRef(() => ChatGatewayModule),
	],
	controllers: [ChatAppController, ChatCmsController],
	providers: [ChatAppService, ChatCmsService, ChatRepository],
	exports: [ChatAppService, ChatCmsService, ChatRepository],
})
export class ChatModule {}
