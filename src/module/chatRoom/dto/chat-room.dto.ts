import { IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChatDto } from '../../chat/dto/chat.dto';
import { IChatRoom } from '../interfaces/chat-room.prisma.interface';
import { IChat } from '../../chat/interfaces/chat.prisma.interface';

export class ChatRoomDto {
	public constructor(room: IChatRoom) {
		this.room_id = room.roomId;
		this.title = room.title;
		this.created = room.createdAt;
		this.chats = room.chats
			? room.chats.map((chat) => {
					return new ChatDto(chat as IChat);
				})
			: null;
	}

	@IsNumber()
	@Expose({ name: 'room_id' })
	@ApiProperty({
		title: 'ID жалобы',
		description: 'ID комнаты',
		type: Number,
		format: 'int32',
	})
	room_id: number;

	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Заголовок',
		description: 'Название комнаты',
		type: String,
	})
	title: string;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления комнаты',
		type: Date,
	})
	created: Date;

	@ValidateNested({ each: true })
	@Type(() => ChatDto)
	@Expose({ name: 'chats' })
	@ApiProperty({
		title: 'Список чатов',
		description: 'Список чатов комнаты',
		isArray: true,
		type: ChatDto,
	})
	chats: ChatDto[];
}
