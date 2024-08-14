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
import {
	ApiBearerAuth,
	ApiExcludeController,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags
} from "@nestjs/swagger";
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ChatUpdateDto } from './dto/chat.update.dto';
import { ChatCreateDto } from './dto/chat.create.dto';
import { ChatDto } from './dto/chat.dto';
import { ChatCmsService } from './chat-cms.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatFilterDto } from './dto/chat.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatUserDto } from './dto/chat-user.dto';
import { AdminGuard } from '../../common/guards/roles.guard';

@ApiExcludeController()
@ApiTags('CMS: Чаты')
@Controller('cms/chat')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ChatCmsController {
	constructor(private chatService: ChatCmsService) {}

	@Get()
	@ApiOperation({
		summary: 'Список чатов (любых)',
		description: 'Получить список чатов по фильтрам (любых)',
	})
	@ApiOkResponse({
		description: 'Список чатов',
		type: ChatDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('cms/chat') url: string,
		@Query() query: ChatFilterDto,
	): Promise<PaginationInterface<ChatDto>> {
		return this.chatService.chatList(url, query);
	}

	@Get(':chat_id')
	@ApiOperation({
		summary: 'Чат по ID (любой)',
		description: 'Получить информацию о чате (любом)',
	})
	@ApiOkResponse({
		description: 'Информация о чате',
		type: ChatDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('chat_id') chatId: number): Promise<ChatDto> {
		return this.chatService.getChat(chatId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление чата',
		description: 'Добавление чата',
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

	@Put(':chat_id')
	@ApiOperation({
		summary: 'Редактирование чата (любого)',
		description: 'Редактирование чата (любого)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(@Param('chat_id') chatId: number, @Body() body: ChatUpdateDto): Promise<DefaultResponse> {
		return this.chatService.updateChat(chatId, body);
	}

	@Delete(':chat_id')
	@ApiOperation({
		summary: 'Удаление чата (любой)',
		description: 'Удалить чат (любой)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(@Param('chat_id') chatId: number): Promise<DefaultResponse> {
		return this.chatService.deleteChat(chatId);
	}

	@Delete(':user_1/:user_2')
	@ApiOperation({
		summary: 'Удаление чата (между 2мя юзерами)',
		description: 'Удаление чата (между 2мя юзерами)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async deleteBetweenPair(
		@Param('user_1') userId: string,
		@Param('user_2') partnerId: string,
	): Promise<DefaultResponse> {
		return this.chatService.deleteChatBetweenPair(userId, partnerId);
	}

	@Post('attach')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление пользователя в чат (любого)',
		description: 'Добавление пользователя в чат (любого',
	})
	@ApiResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 201,
	})
	public async addUserToChat(@Body() body: ChatUserDto): Promise<DefaultResponse> {
		return this.chatService.attachUser(body);
	}

	@Post('detach')
	@ApiOperation({
		summary: 'Удаление пользователя из чата (любого)',
		description: 'Удаление пользователя из чата (любого)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async removeUserFromChat(@Body() body: ChatUserDto): Promise<DefaultResponse> {
		return this.chatService.detachUser(body);
	}
}
