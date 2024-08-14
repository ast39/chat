import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { MessageAppController } from './message-app.controller';
import { ChatModule } from '../chat/chat.module';
import { MessageVersionModule } from '../messageVersion/message-version.module';
import { MessageCmsController } from './message-cms.controller';
import { MyLoggerModule } from '../../common/logger/my-logger.module';
import { ChatGatewayModule } from '../../gateway/chat/chat-gateway.module';

@Module({
	imports: [
		MyLoggerModule,
		forwardRef(() => ChatModule),
		forwardRef(() => MessageVersionModule),
		forwardRef(() => ChatGatewayModule),
	],
	controllers: [MessageAppController, MessageCmsController],
	providers: [MessageService, MessageRepository],
	exports: [MessageService, MessageRepository],
})
export class MessageModule {}
