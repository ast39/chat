import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRoomUpdateDto {
	@IsOptional()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Название',
		description: 'Название комнаты',
		type: String,
		required: false,
	})
	title?: string;
}
