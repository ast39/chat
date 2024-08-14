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
import { ChatRoomUpdateDto } from './dto/chat-room.update.dto';
import { ChatRoomCreateDto } from './dto/chat-room.create.dto';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatRoomService } from './chat-room.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatRoomFilterDto } from './dto/chat-room.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/roles.guard';

@ApiExcludeController()
@ApiTags('CMS: Комнаты чата')
@Controller('cms/room')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ChatRoomCmsController {
	constructor(private chatRoomService: ChatRoomService) {}

	@Get()
	@ApiOperation({
		summary: 'Список комнат',
		description: 'Получить список комнат по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список комнат',
		type: ChatRoomDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('cms/room') url: string,
		@Query() query: ChatRoomFilterDto,
	): Promise<PaginationInterface<ChatRoomDto>> {
		return await this.chatRoomService.chatRoomList(url, query);
	}

	@Get(':room_id')
	@ApiOperation({
		summary: 'Комната по ID',
		description: 'Получить информацию о комнате',
	})
	@ApiOkResponse({
		description: 'Информация о комнате',
		type: ChatRoomDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('room_id') roomId: number): Promise<ChatRoomDto> {
		return await this.chatRoomService.getChatRoom(roomId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление комнаты',
		description: 'Добавление комнаты чата',
	})
	@ApiResponse({
		description: 'Добавленная комната',
		type: ChatRoomDto,
		isArray: false,
		status: 201,
	})
	public async create(@Body() body: ChatRoomCreateDto): Promise<ChatRoomDto> {
		return await this.chatRoomService.createChatRoom(body);
	}

	@Put(':room_id')
	@ApiOperation({
		summary: 'Редактирование комнаты',
		description: 'Редактирование комнаты',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(@Param('room_id') roomId: number, @Body() body: ChatRoomUpdateDto): Promise<DefaultResponse> {
		return await this.chatRoomService.updateChatRoom(roomId, body);
	}

	@Delete(':room_id')
	@ApiOperation({
		summary: 'Удаление комнату',
		description: 'Удалить комнату',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(@Param('room_id') roomId: number): Promise<DefaultResponse> {
		return await this.chatRoomService.deleteChatRoom(roomId);
	}
}
