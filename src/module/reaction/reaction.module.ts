import { forwardRef, Module } from "@nestjs/common";
import { ReactionService } from './reaction.service';
import { ReactionRepository } from './reaction.repository';
import { ReactionAppController } from './reaction-app.controller';
import { MessageModule } from "../message/message.module";
import { ChatModule } from "../chat/chat.module";
import { ReactionCmsController } from "./reaction-cms.controller";

@Module({
	imports: [forwardRef(() => MessageModule), forwardRef(() => ChatModule)],
	controllers: [ReactionAppController, ReactionCmsController],
	providers: [ReactionService, ReactionRepository],
	exports: [ReactionService, ReactionRepository],
})
export class ReactionModule {}
