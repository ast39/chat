import { forwardRef, Module } from "@nestjs/common";
import { MessageVersionService } from './message-version.service';
import { MessageVersionRepository } from './message-version.repository';
import { MessageVersionCmsController } from './message-version-cms.controller';
import { MessageModule } from "../message/message.module";

@Module({
	imports: [forwardRef(() => MessageModule)],
	controllers: [MessageVersionCmsController],
	providers: [MessageVersionService, MessageVersionRepository],
	exports: [MessageVersionService, MessageVersionRepository],
})
export class MessageVersionModule {}
