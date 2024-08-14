import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { EClaimStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ClaimFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Expose({ name: 'chat_id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
		required: false,
	})
	@Type(() => Number)
	chat_id?: number;

	@IsOptional()
	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'Нарушивший пользователь',
		description: 'Нарушивший пользователь',
		type: String,
		required: false,
	})
	user_id?: string;

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
