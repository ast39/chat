import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { EAttachmentStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileAddDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(128)
	@Expose({ name: 'url' })
	@ApiProperty({
		title: 'URL',
		description: 'URL файла',
		type: String,
		required: true,
	})
	url: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(128)
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'Название',
		description: 'Название файла',
		type: String,
		required: true,
	})
	name: string;

	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Expose({ name: 'size' })
	@ApiProperty({
		title: 'Размер',
		description: 'Размер файла',
		type: Number,
		format: 'int32',
		required: true,
	})
	size: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(128)
	@Expose({ name: 'key' })
	@ApiProperty({
		title: 'Ключ',
		description: 'Ключ файла',
		type: String,
		required: true,
	})
	key: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(128)
	@Expose({ name: 'bucket' })
	@ApiProperty({
		title: 'Букет',
		description: 'Букет файла',
		type: String,
		required: true,
	})
	bucket: string;

	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'type' })
	@ApiProperty({
		title: 'Тип',
		description: 'Тип файла',
		type: String,
		required: true,
	})
	type: string;

	@IsEnum(EAttachmentStatus)
	@IsOptional()
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус файла',
		enum: EAttachmentStatus,
		required: false,
		default: EAttachmentStatus.ACTIVE,
	})
	status?: EAttachmentStatus = EAttachmentStatus.ACTIVE;
}
