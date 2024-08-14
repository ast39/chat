import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID пользователя',
		type: String,
		required: true,
	})
	user_id: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'user_name' })
	@ApiProperty({
		title: 'Имя',
		description: 'Имя пользователя',
		type: String,
		required: false,
		default: null,
	})
	user_name?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'user_avatar' })
	@ApiProperty({
		title: 'ID аватара',
		description: 'ID аватара',
		type: String,
		required: false,
		default: null,
	})
	user_avatar?: string;
}
