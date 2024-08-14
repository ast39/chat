import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { ReactionCreateDto } from './dto/reaction.create.dto';
import { Reaction } from '@prisma/client';
import { IReactionFilter, IReactionOrder, IReactionUnique } from './interfaces/reaction.prisma.interface';

@Injectable()
export class ReactionRepository {
	constructor(private prisma: PrismaService) {}

	// Всего реакций без пагинации
	async totalRows(
		params: {
			cursor?: IReactionUnique;
			where?: IReactionFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.reaction.count({
			cursor,
			where,
		});
	}

	// Список реакций
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IReactionFilter;
			orderBy?: IReactionOrder;
		},
		tx?: IPrismaTR,
	): Promise<Reaction[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.reaction.findMany({
			skip,
			take,
			where,
			orderBy,
		});
	}

	// Реакция по ID
	async show(reactionId: number, tx?: IPrismaTR): Promise<Reaction> {
		const prisma = tx ?? this.prisma;

		return prisma.reaction.findUnique({
			where: { reactionId: reactionId },
		});
	}

	// Добавить реакцию
	async store(userId: string, data: ReactionCreateDto, tx?: IPrismaTR): Promise<Reaction> {
		const prisma = tx ?? this.prisma;

		return prisma.reaction.create({
			data: {
				messageId: +data.message_id,
				userId: userId,
				content: data.content,
			},
		});
	}

	// Удалить реакцию
	async destroy(where: IReactionUnique, tx?: IPrismaTR): Promise<Reaction> {
		const prisma = tx ?? this.prisma;

		return prisma.reaction.delete({ where });
	}
}
