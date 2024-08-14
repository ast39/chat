import { Injectable } from '@nestjs/common';
import { HeicConverterService } from '../converter/heic-converter.service';
import { MovConverterService } from '../converter/mov-converter.service';
import { S3Service } from '../s3/s3.service';
import { FileRepository } from './file.repository';
import { Multer } from 'multer';
import { FileDto } from './dto/file.dto';
import { FileDataResponseDto } from '../converter/dto/file-data-response.dto';
import { UploadResponseDto } from '../s3/dto/upload-response.dto';
import { MainConnectConfig } from '../s3/configs/main-connect.config';
import { PrismaService } from '../../../prisma';
import { IActionInterface } from '../../../common/interfaces/action.interface';
import { EResponseStatus, EResponseType } from '../../../common/enums/responses';
import { AttachmentNotFoundException } from '../exceptions/attachment.exceptions';
import { M4aConverterService } from '../converter/m4a-converter.service';
import { AacConverterService } from '../converter/aac-converter.service';
import { IAttachment } from './interfaces/attachment-prisma.interface';
import { FileUploadErrorException } from '../exceptions/file.exceptions';

@Injectable()
export class FileService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly fileRepo: FileRepository,
		private readonly heicConverterService: HeicConverterService,
		private readonly movConverterService: MovConverterService,
		private readonly m4aConverterService: M4aConverterService,
		private readonly aacConverterService: AacConverterService,
		private readonly s3Service: S3Service,
	) {}

	// загрузить файл
	public async upload(fileData: Express.Multer.File): Promise<FileDto> {
		let fileDataForUploading: FileDataResponseDto;

		// сначала сделаем конвертацию формата при необходимости
		if (this.heicConverterService.checkFormat(fileData)) {
			fileDataForUploading = await this.heicConverterService.convert(fileData);
		} else if (this.movConverterService.checkFormat(fileData)) {
			fileDataForUploading = await this.movConverterService.convert(fileData);
		} else if (this.m4aConverterService.checkFormat(fileData)) {
			fileDataForUploading = await this.m4aConverterService.convert(fileData);
		} else if (this.aacConverterService.checkFormat(fileData)) {
			fileDataForUploading = await this.aacConverterService.convert(fileData);
		} else {
			fileDataForUploading = this.movConverterService.defAnswer(fileData);
		}

		// загрузим файл в S3 хранилище
		this.s3Service.setConfig(MainConnectConfig);
		const uploadProcess: UploadResponseDto = await this.s3Service.uploadFile(
			fileDataForUploading.contentType,
			fileDataForUploading.fileData,
		);

		if (!uploadProcess) {
			throw new FileUploadErrorException();
		}

		// и в окончании запишем информауию в БД
		const newFile = await this.prisma.$transaction(async (tr) => {
			return this.fileRepo.addFile(
				{
					url: uploadProcess.url,
					name: fileDataForUploading.fileName,
					size: fileData.size,
					key: uploadProcess.key,
					bucket: uploadProcess.bucket,
					type: fileDataForUploading.contentType,
				},
				tr,
			);
		});

		const file = await this.fileRepo.getFile(newFile.key);

		return new FileDto(file as IAttachment);
	}

	// получить файл
	public async fetch(fileKey: string): Promise<FileDto> {
		const fileData = await this.fileRepo.getFile(fileKey);
		if (!fileData) {
			throw new AttachmentNotFoundException();
		}
		return new FileDto(fileData as IAttachment);
	}

	// показать изображение
	public async showImage(fileKey: string): Promise<any> {
		const fileData = await this.fileRepo.getFile(fileKey);
		if (!fileData) {
			throw new AttachmentNotFoundException();
		}

		this.s3Service.setConfig(MainConnectConfig);

		return this.s3Service.downloadFile(fileKey);
	}

	// проиграть аудио
	public async showAudio(fileKey: string): Promise<any> {
		const fileData = await this.fileRepo.getFile(fileKey);
		if (!fileData) {
			throw new AttachmentNotFoundException();
		}

		this.s3Service.setConfig(MainConnectConfig);

		return this.s3Service.downloadFile(fileKey);
	}

	// проиграть видео
	public async showVideo(fileKey: string): Promise<any> {
		const fileData = await this.fileRepo.getFile(fileKey);
		if (!fileData) {
			throw new AttachmentNotFoundException();
		}

		this.s3Service.setConfig(MainConnectConfig);

		return this.s3Service.downloadFile(fileKey);
	}

	// удалить файл
	public async delete(fileKey: string): Promise<IActionInterface> {
		const file = await this.fileRepo.getFile(fileKey);
		if (!file) {
			throw new AttachmentNotFoundException();
		}

		this.s3Service.setConfig(MainConnectConfig);
		await this.s3Service.deleteFile(fileKey);
		await this.fileRepo.deleteFile(fileKey);

		return {
			status: EResponseStatus.SUCCESS,
			message: 'Файл успешно удален',
			type: EResponseType.NOTIFICATION,
		};
	}
}
