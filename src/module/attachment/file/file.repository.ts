import { Injectable } from '@nestjs/common';
import { FileAddDto } from './dto/file-add.dto';
import { FileDto } from './dto/file.dto';
import { IPrismaTR, PrismaService } from '../../../prisma';
import { EAttachmentStatus } from '@prisma/client';

@Injectable()
export class FileRepository {
	constructor(private prisma: PrismaService) {}

	// Добавление файла
	async addFile(data: FileAddDto, tr?: IPrismaTR): Promise<FileDto> {
		const prisma = tr ?? this.prisma;

		return prisma.attachment.create({
			data,
		});
	}

	// Считывание файла
	async getFile(fileKey: string, tr?: IPrismaTR): Promise<FileDto> {
		const prisma = tr ?? this.prisma;

		const fileData = await prisma.attachment.findFirst({
			where: { key: fileKey },
		});

		if (fileData) {
			await this.fixFetchDate(fileData.key);
		}

		return fileData;
	}

	// фиксация получения файла
	async fixFetchDate(fileKey: string, tr?: IPrismaTR): Promise<number> {
		const prisma = tr ?? this.prisma;

		const currentDate = new Date();
		const timestamp = currentDate.toISOString();

		const result = await prisma.attachment.updateMany({
			where: { key: fileKey },
			data: { fetchedAt: timestamp },
		});

		return result.count;
	}

	// Удаляем файл
	async deleteFile(fileKey: string, tr?: IPrismaTR): Promise<number> {
		const prisma = tr ?? this.prisma;

		const result = await prisma.attachment.deleteMany({
			where: { key: fileKey },
		});

		return result.count;
	}
}
