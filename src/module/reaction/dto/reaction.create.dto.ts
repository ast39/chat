import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'message_id' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
		required: true,
	})
	message_id: number;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Код реакции',
		description: 'Код реакции',
		type: String,
		required: true,
	})
	content: string;
}
