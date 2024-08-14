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
import { ChatUpdateDto } from './dto/chat.update.dto';
import { ChatCreateDto } from './dto/chat.create.dto';
import { ChatDto } from './dto/chat.dto';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatFilterDto } from './dto/chat.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../../common/decorators/user.decorator';
import { ChatUserDto } from './dto/chat-user.dto';
import { Bearer } from '../../common/decorators/bearer.decorator';
import { ChatAppService } from './chat-app.service';

@ApiTags('Чаты')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatAppController {
	constructor(private chatService: ChatAppService) {}

	@Get()
	@ApiOperation({
		summary: 'Список чатов (только свои)',
		description: 'Получить список чатов по фильтрам (только свои)',
	})
	@ApiOkResponse({
		description: 'Список чатов',
		type: ChatDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@JwtUser('id') userId: string,
		@CurrentUrl('chat') url: string,
		@Query() query: ChatFilterDto,
	): Promise<PaginationInterface<ChatDto>> {
		return this.chatService.chatList(url, query, userId);
	}

	@Get(':chat_id')
	@ApiOperation({
		summary: 'Чат по ID (только свой)',
		description: 'Получить информацию о чате (только своем)',
	})
	@ApiOkResponse({
		description: 'Информация о чате',
		type: ChatDto,
		isArray: false,
		status: 200,
	})
	public async show(@JwtUser('id') userId: string, @Param('chat_id') chatId: number): Promise<ChatDto> {
		return this.chatService.getChat(chatId, userId);
	}

	@ApiExcludeEndpoint()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	@ApiOperation({
		summary: 'Создание чата',
		description: 'Создание чата',
	})
	@ApiResponse({
		description: 'Добавленный чат',
		type: ChatDto,
		isArray: false,
		status: 201,
	})
	public async create(@Body() body: ChatCreateDto): Promise<ChatDto> {
		return this.chatService.createChat(body);
	}

	@ApiExcludeEndpoint()
	@Put(':chat_id')
	@ApiOperation({
		summary: 'Редактирование чата (только своего)',
		description: 'Редактирование чата (только своего)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(
		@JwtUser('id') userId: string,
		@Param('chat_id') chatId: number,
		@Body() body: ChatUpdateDto,
	): Promise<DefaultResponse> {
		return this.chatService.updateChat(chatId, body, userId);
	}

	@Put('read/:chat_id')
	@ApiOperation({
		summary: 'Прочитать все сообщения партнера (только в своем чате)',
		description: 'Прочитать все сообщения партнера (только в своем чате)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async readMessages(@JwtUser('id') userId: string, @Param('chat_id') chatId: number): Promise<DefaultResponse> {
		return this.chatService.readChatMessages(chatId, userId);
	}

	@Delete(':chat_id')
	@ApiOperation({
		summary: 'Удаление чата (только своего)',
		description: 'Удалить чат (только свой)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(
		@Bearer() bearerToken: string,
		@JwtUser('id') userId: string,
		@Param('chat_id') chatId: number,
	): Promise<DefaultResponse> {
		return this.chatService.deleteChat(chatId, userId, bearerToken);
	}

	@Post('attach')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление пользователя в чат (себя)',
		description: 'Добавление пользователя в чат (себя)',
	})
	@ApiResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 201,
	})
	public async addUserToChat(@JwtUser('id') userId: string, @Body() body: ChatUserDto): Promise<DefaultResponse> {
		return this.chatService.attachUser(body, userId);
	}

	@Post('detach')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Выход из чата (себя)',
		description: 'Выход пользователя из чата',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async removeUserFromChat(@JwtUser('id') userId: string, @Body() body: ChatUserDto): Promise<DefaultResponse> {
		return this.chatService.detachUser(body, userId);
	}
}
