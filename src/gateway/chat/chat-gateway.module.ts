import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MyLoggerModule } from '../../common/logger/my-logger.module';

@Module({
	imports: [MyLoggerModule],
	providers: [ChatGateway],
	exports: [ChatGateway],
})
export class ChatGatewayModule {}
