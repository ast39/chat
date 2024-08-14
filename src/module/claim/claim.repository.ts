import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { IClaimFilter, IClaimOrder, IClaimUnique } from './interfaces/claim.prisma.interface';
import { ClaimUpdateDto } from './dto/claim.update.dto';
import { ClaimCreateDto } from './dto/claim.create.dto';
import { Claim, EClaimStatus } from '@prisma/client';
import { EBooleanStatus } from "../../common/enums/boolean-status.enum";
@Injectable()
export class ClaimRepository {
	constructor(private prisma: PrismaService) {}

	// Всего жалоб без пагинации
	async totalRows(
		params: {
			cursor?: IClaimUnique;
			where?: IClaimFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.claim.count({
			cursor,
			where,
		});
	}

	// Список жалоб
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IClaimFilter;
			orderBy?: IClaimOrder;
		},
		tx?: IPrismaTR,
	): Promise<Claim[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.claim.findMany({
			skip,
			take,
			where,
			orderBy,
		});
	}

	// Жалоба по ID
	async show(claimId: number, tx?: IPrismaTR): Promise<Claim> {
		const prisma = tx ?? this.prisma;

		return prisma.claim.findUnique({
			where: { claimId: claimId },
		});
	}

	// Добавить жалобу
	async store(userId: string, data: ClaimCreateDto, tx?: IPrismaTR): Promise<Claim> {
		const prisma = tx ?? this.prisma;

		return prisma.claim.create({
			data: {
				chatId: +data.chat_id,
				userId: data.user_id,
				authorId: userId,
				title: data.title,
				body: data.body,
				status: data.status || EClaimStatus.ACTIVE,
			},
		});
	}

	// Обновить жалобу
	async update(
		params: {
			where: IClaimUnique;
			data: ClaimUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<Claim> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.claim.update({
			where,
			data,
		});
	}

	// Удалить жалобу (мягкое удаление)
	async destroy(where: IClaimUnique, tx?: IPrismaTR): Promise<Claim> {
		const prisma = tx ?? this.prisma;

		return prisma.claim.update({
			where,
			data: { isDeleted: EBooleanStatus.TRUE },
		});
	}
}
