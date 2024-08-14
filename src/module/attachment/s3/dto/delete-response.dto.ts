import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class DeleteResponseDto {
	@IsString()
	@IsNotEmpty()
	bucket: string;

	@IsString()
	@IsNotEmpty()
	key: string;

	@IsBoolean()
	deleted: boolean;
}
