import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
	@IsOptional()
	@IsString()
	@Expose({ name: 'user_name' })
	@ApiProperty({
		title: 'Имя',
		description: 'Имя пользователя',
		type: String,
		required: false,
	})
	userName?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'user_avatar' })
	@ApiProperty({
		title: 'ID аватара',
		description: 'ID аватара',
		type: String,
		required: false,
	})
	userAvatar?: string;
}
