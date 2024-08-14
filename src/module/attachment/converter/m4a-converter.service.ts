import { Injectable } from '@nestjs/common';
import { AbstractConverterService } from './abstract-converter.service';
import { FileDataResponseDto } from './dto/file-data-response.dto';
import { EFormat } from './enums/format.enum';
import * as ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';

@Injectable()
export class M4aConverterService extends AbstractConverterService {
	public constructor() {
		super();
		this.fromFormat = EFormat.M4A;
	}

	// конвертация m4a в mp3
	public async convert(fileData: Express.Multer.File): Promise<FileDataResponseDto> {
		if (!this.checkFormat(fileData)) {
			return this.defAnswer(fileData);
		}

		const contentType = 'audio/mpeg';
		const fileName = fileData.originalname.replace(new RegExp('.((m4a)|(M4A))$'), '.mp3');

		const outputBuffer = await this.convertM4aToMp3(fileData.buffer);

		return {
			contentType: contentType,
			fileName: fileName,
			fileData: outputBuffer,
		};
	}

	private convertM4aToMp3(inputBuffer: Buffer): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const inputStream = new Readable();
			inputStream.push(inputBuffer);
			inputStream.push(null);

			const outputStream = new PassThrough();
			const chunks: Buffer[] = [];

			outputStream.on('data', (chunk) => {
				chunks.push(chunk);
			});

			outputStream.on('end', () => {
				resolve(Buffer.concat(chunks));
			});

			const ffmpegCommand = ffmpeg(inputStream)
				.inputFormat('m4a')
				.outputFormat('mp3')
				.on('start', (commandLine) => {
					console.log('Spawned Ffmpeg with command: ' + commandLine);
				})
				.on('codecData', (data) => {
					console.log('Input is ' + data.audio + ' audio');
				})
				.on('progress', (progress) => {
					console.log('Processing:', progress.targetSize + 'kb');
				})
				.on('end', () => {
					console.log('Processing finished!');
					outputStream.end();
				})
				.on('error', (err, stdout, stderr) => {
					console.error('An error occurred: ' + err.message, err, stderr);
					reject(err);
				})
				.pipe(outputStream, { end: true });
		});
	}

	// проверка на M4A формат
	public checkFormat(fileData: Express.Multer.File): boolean {
		return fileData.originalname.toLowerCase().includes('.m4a');
	}
}
