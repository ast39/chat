import { Controller, Param, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatRoomService } from './chat-room.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatRoomFilterDto } from './dto/chat-room.filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Комнаты чата')
@Controller('room')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatRoomAppController {
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
		@CurrentUrl('room') url: string,
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
}
