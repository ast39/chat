import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ReactionRepository } from './reaction.repository';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ReactionCreateDto } from './dto/reaction.create.dto';
import { ReactionDto } from './dto/reaction.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ReactionFilterDto } from './dto/reaction.filter.dto';
import { ReactionNotFoundException, ReactionNotYourException } from './exceptions/reaction.exceptions';
import { MessageService } from "../message/message.service";

@Injectable()
export class ReactionService {
	constructor(
		private prisma: PrismaService,
		private reactionRepo: ReactionRepository,
		private messageService: MessageService,
	) {}

	// Список реакций
	async reactionList(
		url: string,
		reactionFilter: ReactionFilterDto,
	): Promise<PaginationInterface<ReactionDto>> {
		const page = Number(reactionFilter.page ?? 1);
		const limit = Number(reactionFilter.limit ?? 10);

		const reactions = await this.prisma.$transaction(async (tx) => {
			// Получим реакции
			const reactions = await this.reactionRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						messageId: +reactionFilter.message_id || undefined,
						userId: reactionFilter.user_id || undefined,
					},
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!reactions.length) {
				throw new ReactionNotFoundException();
			}

			return reactions;
		});

		// Получим общее кол-во записей
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.reactionRepo.totalRows(
				{
					where: {
						messageId: +reactionFilter.message_id || undefined,
						userId: reactionFilter.user_id || undefined,
					},
				},
				tx,
			);
		});

		// Ответ
		return {
			data: reactions.map((reaction) => new ReactionDto(reaction)),
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

	// Найти реакцию по ID
	async getReaction(reactionId: number): Promise<ReactionDto> {
		return this.prisma.$transaction(async (tx) => {
			const reaction = await this.reactionRepo.show(+reactionId, tx);
			// Проверим, что реакция есть
			if (!reaction) {
				throw new ReactionNotFoundException();
			}

			return new ReactionDto(reaction);
		});
	}

	// Добавить реакцию
	async createReaction(data: ReactionCreateDto, userId?: string): Promise<ReactionDto> {
		return this.prisma.$transaction(async (tx) => {
			// Проверим, что сообщение такое есть
			await this.messageService.getMessage(data.message_id);

			// Добавим реакцию
			const newReaction = await this.reactionRepo.store(userId, data, tx);

			return new ReactionDto(newReaction);
		});
	}

	// Удалить реакцию
	async deleteReaction(reactionId: number, userId?: string): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Проверка что реакция есть
			const reaction = await this.getReaction(+reactionId);

			// Проверка, что это моя реакция
			if (userId && reaction.user_id !== userId) {
				throw new ReactionNotYourException();
			}

			// Удалим реакцию
			await this.reactionRepo.destroy({ reactionId: +reactionId }, tx);

			return { success: true };
		});
	}
}
