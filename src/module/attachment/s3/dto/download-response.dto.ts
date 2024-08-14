import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DownloadResponseDto {
	@IsString()
	@IsNotEmpty()
	bucket: string;

	@IsString()
	@IsNotEmpty()
	key: string;

	@IsOptional()
	data: any;
}
