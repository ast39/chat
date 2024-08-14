import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../../prisma';
import { UserCmsController } from "./user-cms.controller";

@Module({
	imports: [PrismaModule],
	controllers: [UserCmsController],
	providers: [UserService, UserRepository],
	exports: [UserService],
})
export class UserModule {}
