import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { MyLoggerModule } from './common/logger/my-logger.module';
import { ClaimModule } from './module/claim/claim.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { ChatRoomModule } from './module/chatRoom/chat-room.module';
import { ChatModule } from './module/chat/chat.module';
import { MessageModule } from './module/message/message.module';
import { ReactionModule } from './module/reaction/reaction.module';
import { MessageVersionModule } from './module/messageVersion/message-version.module';
import { ConverterModule } from './module/attachment/converter/converter.module';
import { S3Module } from './module/attachment/s3/s3.module';
import { FileModule } from './module/attachment/file/file.module';
import { LoggerMiddleware } from './common/middlewares/log.middleware';
import { ChatGatewayModule } from './gateway/chat/chat-gateway.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.dev.env'),
		}),
		PrismaModule,
		MyLoggerModule,
		ChatGatewayModule,
		AuthModule,
		UserModule,
		ChatRoomModule,
		ChatModule,
		MessageModule,
		MessageVersionModule,
		ConverterModule,
		S3Module,
		FileModule,
		ReactionModule,
		ClaimModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
