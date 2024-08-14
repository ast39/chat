import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatUserDto {
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
	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя',
		type: String,
		required: true,
	})
	user_id: string;
}
