import { Controller, Param, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ReactionDto } from './dto/reaction.dto';
import { ReactionService } from './reaction.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ReactionFilterDto } from './dto/reaction.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/roles.guard';

@ApiExcludeController()
@ApiTags('CMS: Реакции')
@ApiExcludeController()
@Controller('cms/reaction')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ReactionCmsController {
	constructor(private reactionService: ReactionService) {}

	@Get()
	@ApiOperation({
		summary: 'Список реакций (любых)',
		description: 'Получить список реакций по фильтрам (любых)',
	})
	@ApiOkResponse({
		description: 'Список реакций',
		type: ReactionDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('cms/reaction') url: string,
		@Query() query: ReactionFilterDto,
	): Promise<PaginationInterface<ReactionDto>> {
		return await this.reactionService.reactionList(url, query);
	}

	@Get(':reaction_id')
	@ApiOperation({
		summary: 'Реакция по ID (любая)',
		description: 'Получить информацию о реакции (любой)',
	})
	@ApiOkResponse({
		description: 'Информация о реакции',
		type: ReactionDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('reaction_id') reactionId: number): Promise<ReactionDto> {
		return await this.reactionService.getReaction(reactionId);
	}

	@Delete(':reaction_id')
	@ApiOperation({
		summary: 'Удаление реакции (любой)',
		description: 'Удалить реакцию на сообщение (лубую)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(@Param('reaction_id') reactionId: number): Promise<DefaultResponse> {
		return await this.reactionService.deleteReaction(reactionId);
	}
}
