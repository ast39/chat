import { IsNotEmpty, IsString } from 'class-validator';

// ответ метода конвертации
export class FileDataResponseDto {
	@IsString()
	@IsNotEmpty()
	fileName: string;

	@IsString()
	@IsNotEmpty()
	fileData: ArrayBuffer;

	@IsString()
	@IsNotEmpty()
	contentType: string;
}
