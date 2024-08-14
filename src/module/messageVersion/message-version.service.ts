import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageVersionCreateDto } from './dto/message-version.create.dto';
import { MessageVersionDto } from './dto/message-version.dto';
import { MessageVersionRepository } from './message-version.repository';
import { MessageVersionFilterDto } from './dto/message-version.filter.dto';
import { MessageVersionNotFoundException } from './exceptions/message-version.exceptions';

@Injectable()
export class MessageVersionService {
	constructor(
		private prisma: PrismaService,
		private messageVersionRepo: MessageVersionRepository,
	) {}

	// Список сообщений в истории
	async messageVersionList(
		url: string,
		messageVersionFilter: MessageVersionFilterDto,
	): Promise<PaginationInterface<MessageVersionDto>> {
		const page = Number(messageVersionFilter.page ?? 1);
		const limit = Number(messageVersionFilter.limit ?? 10);

		// Список сообщений архива
		const messageVersions = await this.prisma.$transaction(async (tx) => {
			const messageVersions = await this.messageVersionRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						messageId: +messageVersionFilter.message_id || undefined,
					},
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!messageVersions.length) {
				throw new MessageVersionNotFoundException();
			}

			return messageVersions;
		});

		// Всего сообщений в архиве
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.messageVersionRepo.totalRows(
				{
					where: {
						messageId: +messageVersionFilter.message_id || undefined,
					},
				},
				tx,
			);
		});

		// Ответ
		return {
			data: messageVersions.map((messageVersion) => new MessageVersionDto(messageVersion)),
			meta: {
				currentPage: page,
				lastPage: Math.ceil(totalRows / limit),
				perPage: limit,
				from: (page - 1) * limit + 1,
				to: (page - 1) * limit + limit,
				total: totalRows,
				path: url,
			},
		};
	}

	// Найти сообщение в истории по ID
	async getMessageVersion(messageVersionId: number): Promise<MessageVersionDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим сообщение из архива
			const messageVersion = await this.messageVersionRepo.show(+messageVersionId, tx);
			if (!messageVersion) {
				throw new MessageVersionNotFoundException();
			}

			return new MessageVersionDto(messageVersion);
		});
	}

	// Добавить сообщение в историю
	async createMessageVersion(data: MessageVersionCreateDto): Promise<MessageVersionDto> {
		return this.prisma.$transaction(async (tx) => {
			// Добавим сообщение в архив
			const newMessageVersion = await this.messageVersionRepo.store(data, tx);

			return new MessageVersionDto(newMessageVersion);
		});
	}
}
