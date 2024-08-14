import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EClaimStatus } from '@prisma/client';

export class ClaimUpdateDto {
	@IsOptional()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Заголовок',
		description: 'Заголовок жалобы',
		type: String,
		required: false,
	})
	title?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'body' })
	@ApiProperty({
		title: 'Контент',
		description: 'Контент жалобы',
		type: String,
		required: false,
	})
	body?: string;

	@IsOptional()
	@IsEnum(EClaimStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус жалобы',
		enum: EClaimStatus,
		required: false,
	})
	status?: EClaimStatus;
}
