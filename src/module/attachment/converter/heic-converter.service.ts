import { Injectable } from '@nestjs/common';
import { AbstractConverterService } from './abstract-converter.service';
import { FileDataResponseDto } from './dto/file-data-response.dto';
import { EFormat } from './enums/format.enum';
import * as heicConvert from 'heic-convert';

@Injectable()
export class HeicConverterService extends AbstractConverterService {
	public constructor() {
		super();
		this.fromFormat = EFormat.HEIC;
	}

	// конвертация  heic в png
	public async convert(fileData: Express.Multer.File): Promise<FileDataResponseDto> {
		if (!this.checkFormat(fileData)) {
			return this.defAnswer(fileData);
		}

		const contentType = 'image/png';
		const fileName = fileData.originalname.replace(new RegExp('.((heic)|(HEIC))$'), '.png');
		const outputBuffer = await heicConvert({
			buffer: fileData.buffer,
			format: 'PNG',
		});

		return {
			contentType: contentType,
			fileName: fileName,
			fileData: outputBuffer,
		};
	}

	// проверка на HEIC формат
	public checkFormat(fileData: Express.Multer.File): boolean {
		return fileData.originalname.toLowerCase().includes('.heic');
	}
}
