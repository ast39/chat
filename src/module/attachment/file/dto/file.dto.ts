import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IAttachment } from '../interfaces/attachment-prisma.interface';
import { EAttachmentStatus } from '@prisma/client';

export class FileDto {
	public constructor(file: IAttachment) {
		this.attachmentId = file.attachmentId;
		this.url = file.url;
		this.name = file.name;
		this.size = file.size;
		this.key = file.key;
		this.bucket = file.bucket;
		this.type = file.type;
		this.status = file.status;
		this.fetched = file.fetchedAt;
		this.created = file.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID файла',
		type: Number,
		format: 'int32',
		required: true,
	})
	attachmentId: number;

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

	@IsDate()
	@IsOptional()
	@Expose({ name: 'fetched' })
	@ApiProperty({
		title: 'Последний запрос',
		description: 'Время последнего запроса файла',
		type: Date,
		required: false,
	})
	fetched?: Date;

	@IsDate()
	@IsOptional()
	@Expose({ name: 'created' })
	@Exclude()
	@ApiProperty({
		title: 'Время загрузки',
		description: 'Время добавления файла',
		type: Date,
		required: false,
	})
	created?: Date;

	@IsDate()
	@IsOptional()
	@Expose({ name: 'updated' })
	@Exclude()
	@ApiProperty({
		title: 'Время обновления',
		description: 'Время последнего обновления файла',
		type: Date,
		required: false,
	})
	updated?: Date;
}
