import {
	Body,
	Controller,
	Param,
	Get,
	Post,
	Put,
	Delete,
	Query,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { MessageUpdateDto } from './dto/message.update.dto';
import { MessageAppCreateDto } from './dto/message-app.create.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageFilterDto } from './dto/message.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../../common/decorators/user.decorator';

@ApiTags('Сообщения')
@Controller('message')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessageAppController {
	constructor(private messageService: MessageService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление сообщения (от совего имени)',
		description: 'Добавление сообщения в чат (от совего имени)',
	})
	@ApiResponse({
		description: 'Добавленное сообщение',
		type: MessageDto,
		isArray: false,
		status: 201,
	})
	public async create(@JwtUser('id') userId: string, @Body() body: MessageAppCreateDto): Promise<MessageDto> {
		return await this.messageService.createMessageFromApp(body, userId);
	}

	@Put(':message_id')
	@ApiOperation({
		summary: 'Редактирование сообщения (только своего)',
		description: 'Редактирование сообщения (только своего',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(
		@JwtUser('id') userId: string,
		@Param('message_id') messageId: number,
		@Body() body: MessageUpdateDto,
	): Promise<DefaultResponse> {
		return await this.messageService.updateMessage(messageId, body, userId);
	}

	@Delete(':message_id')
	@ApiOperation({
		summary: 'Удаление сообщения (только своего)',
		description: 'Удалить сообщения (только своего)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(@JwtUser('id') userId: string, @Param('message_id') messageId: number): Promise<DefaultResponse> {
		return await this.messageService.deleteMessage(messageId, userId);
	}
}
