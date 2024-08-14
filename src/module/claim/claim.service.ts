import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ClaimRepository } from './claim.repository';
import { ClaimUpdateDto } from './dto/claim.update.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ClaimCreateDto } from './dto/claim.create.dto';
import { ClaimDto } from './dto/claim.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ClaimFilterDto } from './dto/claim.filter.dto';
import { ClaimNotFoundException } from './exceptions/cllaim.exceptions';

@Injectable()
export class ClaimService {
	constructor(
		private prisma: PrismaService,
		private claimRepo: ClaimRepository,
	) {}

	// Список жалоб
	async claimList(url: string, claimFilter: ClaimFilterDto): Promise<PaginationInterface<ClaimDto>> {
		const page = Number(claimFilter.page ?? 1);
		const limit = Number(claimFilter.limit ?? 10);

		// Список жалоб
		const claims = await this.prisma.$transaction(async (tx) => {
			const claims = await this.claimRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						chatId: +claimFilter.chat_id || undefined,
						userId: claimFilter.user_id || undefined,
						status: claimFilter.status || undefined,
					},
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!claims.length) {
				throw new ClaimNotFoundException();
			}

			return claims;
		});

		// Всего жалоб
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.claimRepo.totalRows(
				{
					where: {
						chatId: +claimFilter.chat_id || undefined,
						userId: claimFilter.user_id || undefined,
						status: claimFilter.status || undefined,
					},
				},
				tx,
			);
		});

		// Ответ
		return {
			data: claims.map((claim) => new ClaimDto(claim)),
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

	// Найти жалобу по ID
	async getClaim(claimId: number): Promise<ClaimDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим жалобу
			const claim = await this.claimRepo.show(claimId, tx);
			if (!claim) {
				throw new ClaimNotFoundException();
			}

			return new ClaimDto(claim);
		});
	}

	// Добавить жалобу
	async createClaim(data: ClaimCreateDto, userId?: string): Promise<ClaimDto> {
		return this.prisma.$transaction(async (tx) => {
			const newClaim = await this.claimRepo.store(userId, data, tx);

			return new ClaimDto(newClaim);
		});
	}

	// Обновить жалобу
	async updateClaim(claimId: number, data: ClaimUpdateDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим жалобу
			await this.getClaim(claimId);

			// Обновим жалобу
			await this.claimRepo.update(
				{
					where: { claimId: +claimId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Удалить жалобу
	async deleteClaim(claimId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим жалобу
			await this.getClaim(claimId);

			// Удалим жалобу
			await this.claimRepo.destroy({ claimId: +claimId }, tx);

			return { success: true };
		});
	}
}
