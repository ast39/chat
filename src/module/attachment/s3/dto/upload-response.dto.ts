import { IsNotEmpty, IsString } from 'class-validator';

export class UploadResponseDto {
	@IsString()
	@IsNotEmpty()
	bucket: string;

	@IsString()
	@IsNotEmpty()
	key: string;

	@IsString()
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	url: string;
}
