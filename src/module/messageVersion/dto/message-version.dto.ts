import { IsDate, IsNumber, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IMessageVersion } from '../interfaces/message-version.prisma.interface';

export class MessageVersionDto {
	public constructor(version: IMessageVersion) {
		this.version_id = version.versionId;
		this.message_id = version.messageId;
		this.content = version.content;
		this.created = version.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'version_id' })
	@ApiProperty({
		title: 'ID версии сообщения',
		description: 'ID версии сообщения',
		type: Number,
		format: 'int32',
	})
	version_id: number;

	@IsNumber()
	@Expose({ name: 'message_id' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
	})
	message_id: number;

	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
	})
	content: string;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления жалобы',
		type: Date,
	})
	created: Date;
}
