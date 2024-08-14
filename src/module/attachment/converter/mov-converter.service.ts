import { Injectable } from '@nestjs/common';
import { AbstractConverterService } from './abstract-converter.service';
import { FileDataResponseDto } from './dto/file-data-response.dto';
import { EFormat } from './enums/format.enum';
import * as ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';

@Injectable()
export class MovConverterService extends AbstractConverterService {
	public constructor() {
		super();
		this.fromFormat = EFormat.MOV;
	}

	// конвертация mov в mp4
	public async convert(fileData: Express.Multer.File): Promise<FileDataResponseDto> {
		if (!this.checkFormat(fileData)) {
			return this.defAnswer(fileData);
		}

		const contentType = 'video/mp4';
		const fileName = fileData.originalname.replace(new RegExp('.((mov)|(MOV))$'), '.mp4');

		const outputBuffer = await this.convertMovToMp4(fileData.buffer);

		return {
			contentType: contentType,
			fileName: fileName,
			fileData: outputBuffer,
		};
	}

	// проверка на MOV формат
	public checkFormat(fileData: Express.Multer.File): boolean {
		return fileData.originalname.toLowerCase().includes('.mov');
	}

	private convertMovToMp4(inputBuffer: Buffer): Promise<Buffer> {
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

			ffmpeg(inputStream)
				.inputOptions('-analyzeduration', '2147483647', '-probesize', '2147483647')
				.outputOptions('-movflags', 'frag_keyframe+empty_moov')
				.outputFormat('mp4')
				.on('start', (commandLine) => {
					console.log('Spawned Ffmpeg with command: ' + commandLine);
				})
				.on('codecData', (data) => {
					console.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video');
				})
				.on('progress', (progress) => {
					console.log('Processing: ' + progress.percent + '% done');
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
}
