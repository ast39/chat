import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimRepository } from './claim.repository';
import { ClaimAppController } from './claim-app.controller';
import { ClaimCmsController } from "./claim-cms.controller";

@Module({
	imports: [],
	controllers: [ClaimAppController, ClaimCmsController],
	providers: [ClaimService, ClaimRepository],
	exports: [ClaimService, ClaimRepository],
})
export class ClaimModule {}
