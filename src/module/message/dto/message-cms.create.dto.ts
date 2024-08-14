import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EMessageStatus } from '@prisma/client';

export class MessageCmsCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'author_id' })
	@ApiProperty({
		title: 'ID автора',
		description: 'ID автора',
		type: String,
		required: true,
	})
	author_id: string;

	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'chat_id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
		required: true,
	})
	chat_id: number;

	@IsOptional()
	@IsNumber()
	@Expose({ name: 'reply_to' })
	@ApiProperty({
		title: 'Цитируемое сообщение',
		description: 'Цитируемое сообщение',
		type: Number,
		format: 'int32',
		required: false,
		default: null,
	})
	reply_to?: number | null;

	@IsOptional()
	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
		required: false,
	})
	content?: string;

	@IsOptional()
	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус сообщения',
		enum: EMessageStatus,
		required: false,
		default: EMessageStatus.ACTIVE,
	})
	status?: EMessageStatus;

	@IsOptional()
	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'ID файлов вложений',
		description: 'ID файлов вложений',
		type: Number,
		isArray: true,
		required: false,
	})
	files?: number[];
}
