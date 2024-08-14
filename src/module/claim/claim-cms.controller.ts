import { Body, Controller, Param, Get, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ClaimUpdateDto } from './dto/claim.update.dto';
import { ClaimDto } from './dto/claim.dto';
import { ClaimService } from './claim.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ClaimFilterDto } from './dto/claim.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/roles.guard';

@ApiTags('CMS: Жалобы')
@ApiExcludeController()
@Controller('cms/claim')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ClaimCmsController {
	constructor(private claimService: ClaimService) {}

	@Get()
	@ApiOperation({
		summary: 'Список жалоб',
		description: 'Получить список жалоб по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список жалоб',
		type: ClaimDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('cms/claim') url: string,
		@Query() query: ClaimFilterDto,
	): Promise<PaginationInterface<ClaimDto>> {
		return await this.claimService.claimList(url, query);
	}

	@Get(':claim_id')
	@ApiOperation({
		summary: 'Жалоба по ID',
		description: 'Получить информацию о жалобе',
	})
	@ApiOkResponse({
		description: 'Информация о жалобе',
		type: ClaimDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('claim_id') claimId: number): Promise<ClaimDto> {
		return await this.claimService.getClaim(claimId);
	}

	@Put(':claim_id')
	@ApiOperation({
		summary: 'Редактирование жалобы',
		description: 'Редактирование жалобы',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(@Param('claim_id') claimId: number, @Body() body: ClaimUpdateDto): Promise<DefaultResponse> {
		return await this.claimService.updateClaim(claimId, body);
	}

	@Delete(':claim_id')
	@ApiOperation({
		summary: 'Удаление жалобы',
		description: 'Удалить жалобу',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(@Param('claim_id') claimId: number): Promise<DefaultResponse> {
		return await this.claimService.deleteClaim(claimId);
	}
}
