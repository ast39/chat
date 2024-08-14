import { IsDate, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IMessage } from '../interfaces/message.prisma.interface';
import { EMessageStatus } from '@prisma/client';
import { ReactionDto } from '../../reaction/dto/reaction.dto';
import { IReaction } from '../../reaction/interfaces/reaction.prisma.interface';
import { FileDto } from '../../attachment/file/dto/file.dto';
import { IAttachment } from '../../attachment/file/interfaces/attachment-prisma.interface';

export class MessageDto {
	public constructor(message: IMessage) {
		this.message_id = message.messageId;
		this.chat_id = message.chatId;
		this.reply_to = message.replyToId;
		this.user_id = message.userId;
		this.content = message.content;
		this.read = message.isRead > 0;
		this.status = message.status;
		this.created = message.createdAt;
		this.reactions = message.reactions
			? message.reactions.map((reaction) => {
					return new ReactionDto(reaction as IReaction);
				})
			: null;
		this.attachments =
			message.attachments !== undefined && message.attachments.length > 0
				? message.attachments.map((attachment) => {
						if (attachment && attachment.attachment) {
							return new FileDto(attachment.attachment as IAttachment);
						}
						return null;
					})
				: null;
	}

	@IsNumber()
	@Expose({ name: 'message_id' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
	})
	message_id: number;

	@IsNumber()
	@Expose({ name: 'chat_id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
	})
	chat_id: number;

	@IsNumber()
	@Expose({ name: 'reply_to' })
	@ApiProperty({
		title: 'Цитируемое сообщение',
		description: 'Цитируемое сообщение',
		type: Number,
		format: 'int32',
	})
	reply_to?: number | null;

	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID автора',
		description: 'ID автора сообщения',
		type: String,
	})
	user_id: string;

	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
	})
	content: string;

	@IsNumber()
	@Expose({ name: 'read' })
	@ApiProperty({
		title: 'Метка прочтения сообщения',
		description: 'Метка прочтения сообщения',
		type: Boolean,
	})
	read: boolean;

	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус жалобы',
		enum: EMessageStatus,
		required: false,
	})
	status: EMessageStatus;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления жалобы',
		type: Date,
	})
	created: Date;

	@ValidateNested({ each: true })
	@Type(() => ReactionDto)
	@Expose({ name: 'reactions' })
	@ApiProperty({
		title: 'Список реакций',
		description: 'Список реакций',
		isArray: true,
		type: ReactionDto,
	})
	reactions: ReactionDto[];

	@ValidateNested({ each: true })
	@Type(() => FileDto)
	@Expose({ name: 'reactions' })
	@ApiProperty({
		title: 'Список вложений',
		description: 'Список вложений',
		isArray: true,
		type: FileDto,
	})
	attachments: FileDto[];
}
