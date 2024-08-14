import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { EMessageStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class MessageFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Expose({ name: 'chat_id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
	})
	@Type(() => Number)
	chat_id?: number;

	@IsOptional()
	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID автора',
		description: 'ID автора сообщения',
		type: String,
	})
	user_id?: string;

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
}
