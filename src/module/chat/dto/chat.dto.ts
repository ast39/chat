import { IsDate, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';
import { IChat } from '../interfaces/chat.prisma.interface';
import { MessageDto } from '../../message/dto/message.dto';
import { UserDto } from '../../user/dto/user.dto';

export class ChatDto {
	public constructor(chat: IChat, userId?: string) {
		const chatVsMe = userId ? chat.users.filter((chatUser) => chatUser.userId === userId) : undefined;
		const chatWoMe = userId ? chat.users.filter((chatUser) => chatUser.userId !== userId) : undefined;

		this.id = chat.chatId;
		this.room_id = chat.roomId;
		this.title = chat.title;
		if (userId) {
			this.waiting =
				chat.messages !== undefined && chat.messages.length > 0
					? chat.messages[chat.messages.length - 1].isRead === 0 &&
						chat.messages[chat.messages.length - 1].userId !== userId
					: false;
		}
		this.status = chat.status;
		this.created = chat.createdAt;
		this.me = chatVsMe !== undefined && chatVsMe.length > 0 ? new UserDto(chatVsMe[0].user) : null;
		this.partner = chatWoMe !== undefined && chatWoMe.length > 0 ? new UserDto(chatWoMe[0].user) : null;
		this.notRead = chat.messages !== undefined && chat.messages.length > 0
			? chat.messages.filter((message) => {
				return +message.isRead === 0 && message.userId !== userId;
			}).length
			: 0;

		this.messages =
			chat.messages !== undefined && chat.messages.length > 0
				? chat.messages.map((message) => {
						return new MessageDto(message);
					})
				: null;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
	})
	id: number;

	@IsNumber()
	@Expose({ name: 'room_id' })
	@ApiProperty({
		title: 'ID комнаты',
		description: 'ID комнаты',
		type: Number,
		format: 'int32',
	})
	room_id: number;

	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Заголовок',
		description: 'Заголовок жалобы',
		type: String,
	})
	title: string;

	@IsString()
	@Expose({ name: 'waiting' })
	@ApiProperty({
		title: 'Метка ожидания ответа',
		description: 'Метка ожидания ответа',
		type: Boolean,
	})
	waiting: boolean;

	@IsEnum(EChatStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: EChatStatus,
	})
	status?: EChatStatus;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления жалобы',
		type: Date,
	})
	created: Date;

	@ValidateNested()
	@Type(() => UserDto)
	@Expose({ name: 'me' })
	@ApiProperty({
		title: 'Мои данные',
		description: 'Мои данные',
		isArray: true,
		type: UserDto,
	})
	me: UserDto;

	@ValidateNested()
	@Type(() => UserDto)
	@Expose({ name: 'partner' })
	@ApiProperty({
		title: 'Собеседник чата',
		description: 'Собеседник чата',
		isArray: true,
		type: UserDto,
	})
	partner: UserDto;

	@IsNumber()
	@Expose({ name: 'notRead' })
	@ApiProperty({
		title: 'Кол-во непрочитанных сообщений',
		description: 'Кол-во непрочитанных сообщений чата',
		type: Number,
	})
	notRead: number = 0;

	@ValidateNested({ each: true })
	@Type(() => MessageDto)
	@Expose({ name: 'messages' })
	@ApiProperty({
		title: 'Список сообщений',
		description: 'Список сообщений чата',
		isArray: true,
		type: MessageDto,
	})
	messages: MessageDto[];
}
