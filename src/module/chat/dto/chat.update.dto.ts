import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';

export class ChatUpdateDto {
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
	room_id?: number;

	@IsOptional()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Название',
		description: 'Название чата',
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
