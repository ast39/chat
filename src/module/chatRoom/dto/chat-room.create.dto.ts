import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRoomCreateDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Название',
		description: 'Название комнаты',
		type: String,
		required: true,
	})
	title: string;
}
