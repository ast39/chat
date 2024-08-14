import { Module } from '@nestjs/common';
import { NetworkTiesService } from './network-ties.service';

@Module({
	imports: [],
	controllers: [],
	providers: [NetworkTiesService],
	exports: [NetworkTiesService],
})
export class NetworkTiesModule {}
