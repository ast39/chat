import { ApiProperty } from '@nestjs/swagger';

export class StorageDto {
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя',
		type: Number,
		default: null,
	})
	userId?: number | null;

	@ApiProperty({
		title: 'Кол-во файлов',
		description: 'Кол-во файлов',
		type: Number,
		default: 0,
	})
	count: number;

	@ApiProperty({
		title: 'Размер всех файлов',
		description: 'Размер всех файлов',
		type: Number,
		default: 0,
	})
	size: number;
}
