import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EClaimStatus } from '@prisma/client';

export class ClaimCreateDto {
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

	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'Нарушивший пользователь',
		description: 'Нарушивший пользователь',
		type: String,
		required: true,
	})
	user_id: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Заголовок',
		description: 'Заголовок жалобы',
		type: String,
		required: true,
	})
	title: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'body' })
	@ApiProperty({
		title: 'Контент',
		description: 'Контент жалобы',
		type: String,
		required: true,
	})
	body: string;

	@IsOptional()
	@IsEnum(EClaimStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус жалобы',
		enum: EClaimStatus,
		required: false,
		default: EClaimStatus.ACTIVE,
	})
	status?: EClaimStatus;
}
