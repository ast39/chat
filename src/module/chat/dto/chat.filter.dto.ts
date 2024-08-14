import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ChatFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Expose({ name: 'room_id' })
	@ApiProperty({
		title: 'ID комнаты',
		description: 'ID комнаты',
		type: Number,
		format: 'int32',
		required: false,
	})
	@Type(() => Number)
	room_id?: number;

	@IsOptional()
	@IsNumber()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя',
		type: String,
		required: false,
	})
	user_id?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Название',
		description: 'чата жалобы',
		type: String,
		required: false,
	})
	title?: string;

	@IsOptional()
	@IsEnum(EChatStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: EChatStatus,
		required: false,
	})
	status?: EChatStatus;
}
