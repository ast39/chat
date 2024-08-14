import { Body, Controller, Param, Get, Post, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ReactionCreateDto } from './dto/reaction.create.dto';
import { ReactionDto } from './dto/reaction.dto';
import { ReactionService } from './reaction.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ReactionFilterDto } from './dto/reaction.filter.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Реакции')
@Controller('reaction')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReactionAppController {
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
		@CurrentUrl('reaction') url: string,
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

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление реакции (от себя)',
		description: 'Добавление реакции на сообщение (от себя)',
	})
	@ApiResponse({
		description: 'Добавленная реакции',
		type: ReactionDto,
		isArray: false,
		status: 201,
	})
	public async create(@JwtUser('id') userId: string, @Body() body: ReactionCreateDto): Promise<ReactionDto> {
		return await this.reactionService.createReaction(body, userId);
	}

	@Delete(':reaction_id')
	@ApiOperation({
		summary: 'Удаление реакции (своей)',
		description: 'Удалить реакцию на сообщение (свою)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(
		@JwtUser('id') userId: string,
		@Param('reaction_id') reactionId: number,
	): Promise<DefaultResponse> {
		return await this.reactionService.deleteReaction(reactionId, userId);
	}
}
