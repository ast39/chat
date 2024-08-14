import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EMessageStatus } from '@prisma/client';

export class MessageUpdateDto {
	@IsOptional()
	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
	})
	content?: string;

	@IsOptional()
	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус жалобы',
		enum: EMessageStatus,
		required: false,
		default: EMessageStatus.ACTIVE,
	})
	status?: EMessageStatus;
}
