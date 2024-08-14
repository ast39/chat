import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';

export class ChatCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'room_id' })
	@ApiProperty({
		title: 'ID комнаты',
		description: 'ID комнаты',
		type: Number,
		format: 'int32',
		required: true,
	})
	room_id: number;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Название',
		description: 'Название чата',
		type: String,
		required: true,
	})
	title: string;

	@IsOptional()
	@IsEnum(EChatStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: EChatStatus,
		required: false,
		default: EChatStatus.ACTIVE,
	})
	status?: EChatStatus;
}
