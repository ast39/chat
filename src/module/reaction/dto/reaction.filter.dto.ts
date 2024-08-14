import { IsNumber, IsOptional, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ReactionFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Expose({ name: 'message_id' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
		required: false,
	})
	@Type(() => Number)
	message_id?: number;

	@IsOptional()
	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя, нарушителя',
		type: String,
		required: false,
	})
	user_id?: string;
}
