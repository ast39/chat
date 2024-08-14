import { Module } from '@nestjs/common';
import { NetworkUserService } from './network-user.service';

@Module({
	imports: [],
	controllers: [],
	providers: [NetworkUserService],
	exports: [NetworkUserService],
})
export class NetworkUserModule {}
