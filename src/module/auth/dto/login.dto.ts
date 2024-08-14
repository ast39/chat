import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'User ID',
		description: 'User ID',
		type: String,
		required: true,
	})
	user_id: string;
}
