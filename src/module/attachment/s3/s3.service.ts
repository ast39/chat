import { Injectable } from '@nestjs/common';
import { IConnectConfig } from './interfaces/connect-config.interface';
import { v4 as uuidv4 } from 'uuid';
import { UploadResponseDto } from './dto/upload-response.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
	private PATH = 'chat';

	private s3: S3Client;
	private s3config: IConnectConfig;

	// создать подключение на базе переданного конфига
	public setConfig(s3config: IConnectConfig) {
		this.s3config = s3config;
		this.s3 = new S3Client(this.s3config);
	}

	// загрузить файл на сервер
	async uploadFile(contentType: string, dataBuffer: any): Promise<UploadResponseDto> {
		const key: string = uuidv4();
		const putObject = new PutObjectCommand({
			Bucket: this.s3config.bucket,
			Key: `${this.PATH}/${key}`,
			ContentType: contentType,
			Body: dataBuffer,
		});

		try {
			await this.s3.send(putObject);

			return {
				bucket: this.s3config.bucket,
				key: key,
				type: contentType,
				url: this.buildFullUrl(key),
			};
		} catch (error) {
			console.info('Error uploading file to S3\r\n', error);
		}
	}

	// скачать файл с сервера
	async downloadFile(key: string): Promise<any> {
		const getObject = new GetObjectCommand({
			Bucket: this.s3config.bucket,
			Key: `${this.PATH}/${key}`,
		});

		try {
			const output = await this.s3.send(getObject);
			const stream = output.Body as Readable;
			const chunks: Buffer[] = [];
			for await (const chunk of stream) {
				chunks.push(chunk);
			}

			const buffer = Buffer.concat(chunks);

			return {
				type: output.ContentType,
				buffer: buffer,
			};
		} catch (error) {
			console.info('Error downloading file from S3\r\n', error);
		}
	}

	// удалить файл с сервера
	async deleteFile(key: string): Promise<DeleteResponseDto> {
		const deleteObject = new DeleteObjectCommand({
			Bucket: this.s3config.bucket,
			Key: key,
		});

		try {
			const deleteProcess = await this.s3.send(deleteObject);

			return {
				bucket: this.s3config.bucket,
				key: key,
				deleted: deleteProcess.DeleteMarker,
			};
		} catch (error) {
			console.info('Error deleting file from S3', error);
		}
	}

	// сформировать ссылку на файл
	buildFullUrl(key: string): string {
		return `https://${this.s3config.bucket}.${this.s3config.endpoint.replace('https://', '')}/${key}`;
	}
}
