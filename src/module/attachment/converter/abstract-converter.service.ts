import { FileDataResponseDto } from './dto/file-data-response.dto';

export abstract class AbstractConverterService {
	// формат, который подлежит конвертации
	protected fromFormat: string;

	public abstract convert(fileData: Express.Multer.File): Promise<FileDataResponseDto>;

	// проверка на формат
	public checkFormat(fileData: Express.Multer.File): boolean {
		return fileData.originalname.toLowerCase().includes(this.fromFormat);
	}

	// ответ без конвертации
	public defAnswer(fileData: Express.Multer.File): FileDataResponseDto {
		return <FileDataResponseDto>{
			contentType: fileData.mimetype,
			fileName: fileData.originalname,
			fileData: fileData.buffer,
		};
	}
}
