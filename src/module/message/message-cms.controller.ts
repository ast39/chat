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
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { MessageUpdateDto } from './dto/message.update.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageFilterDto } from './dto/message.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageCmsCreateDto } from './dto/message-cms.create.dto';
import {
	ApiBearerAuth,
	ApiExcludeController,
	ApiExcludeEndpoint,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags
} from "@nestjs/swagger";
import { AdminGuard } from '../../common/guards/roles.guard';

@ApiExcludeController()
@ApiTags('CMS: Сообщения')
@Controller('cms/message')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class MessageCmsController {
	constructor(private messageService: MessageService) {}

	@Get()
	@ApiExcludeEndpoint()
	@ApiOperation({
		summary: 'Список сообщений (любых)',
		description: 'Получить список сообщений по фильтрам (любых)',
	})
	@ApiOkResponse({
		description: 'Список сообщений',
		type: MessageDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('cms/message') url: string,
		@Query() query: MessageFilterDto,
	): Promise<PaginationInterface<MessageDto>> {
		return await this.messageService.messageList(url, query);
	}

	@Get(':message_id')
	@ApiExcludeEndpoint()
	@ApiOperation({
		summary: 'Сообщение по ID (любое)',
		description: 'Получить информацию о сообщении (любом)',
	})
	@ApiOkResponse({
		description: 'Информация о жалобе',
		type: MessageDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('message_id') messageId: number): Promise<MessageDto> {
		return await this.messageService.getMessage(messageId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление сообщения (от именю любого автора)',
		description: 'Добавление сообщения в чат (от именю любого автора)',
	})
	@ApiResponse({
		description: 'Добавленное сообщение',
		type: MessageDto,
		isArray: false,
		status: 201,
	})
	public async create(@Body() body: MessageCmsCreateDto): Promise<MessageDto> {
		return await this.messageService.createMessageFromCms(body);
	}

	@Put(':message_id')
	@ApiOperation({
		summary: 'Редактирование сообщения (любого)',
		description: 'Редактирование сообщения (любого)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(
		@Param('message_id') messageId: number,
		@Body() body: MessageUpdateDto,
	): Promise<DefaultResponse> {
		return await this.messageService.updateMessage(messageId, body);
	}

	@Delete(':message_id')
	@ApiOperation({
		summary: 'Удаление сообщения (любого)',
		description: 'Удалить сообщения (любое)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(@Param('message_id') messageId: number): Promise<DefaultResponse> {
		return await this.messageService.deleteMessage(messageId);
	}
}
