import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { IChatRoomFilter, IChatRoomOrder, IChatRoomUnique } from './interfaces/chat-room.prisma.interface';
import { ChatRoomUpdateDto } from './dto/chat-room.update.dto';
import { ChatRoomCreateDto } from './dto/chat-room.create.dto';
import { ChatRoom } from '@prisma/client';
import { EBooleanStatus } from "../../common/enums/boolean-status.enum";
@Injectable()
export class ChatRoomRepository {
	constructor(private prisma: PrismaService) {}

	// Всего комнат без пагинации
	async totalRows(
		params: {
			cursor?: IChatRoomUnique;
			where?: IChatRoomFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		where.isDeleted = EBooleanStatus.FALSE;

		return prisma.chatRoom.count({
			cursor,
			where,
		});
	}

	// Список комнат
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IChatRoomFilter;
			orderBy?: IChatRoomOrder;
		},
		tx?: IPrismaTR,
	): Promise<ChatRoom[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		where.isDeleted = EBooleanStatus.FALSE;

		return prisma.chatRoom.findMany({
			skip,
			take,
			where,
			include: { chats: true },
			orderBy,
		});
	}

	// Комната по ID
	async show(chatRoomId: number, tx?: IPrismaTR): Promise<ChatRoom> {
		const prisma = tx ?? this.prisma;

		return prisma.chatRoom.findUnique({
			where: { roomId: +chatRoomId, isDeleted: EBooleanStatus.FALSE },
			include: { chats: true },
		});
	}

	// Добавить комнату
	async store(data: ChatRoomCreateDto, tx?: IPrismaTR): Promise<ChatRoom> {
		const prisma = tx ?? this.prisma;

		return prisma.chatRoom.create({
			data: {
				title: data.title,
			},
		});
	}

	// Обновить комнату
	async update(
		params: {
			where: IChatRoomUnique;
			data: ChatRoomUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<ChatRoom> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.chatRoom.update({
			where,
			data,
		});
	}

	// Удалить комнату (мягкое удаление)
	async destroy(where: IChatRoomUnique, tx?: IPrismaTR): Promise<ChatRoom> {
		const prisma = tx ?? this.prisma;

		return prisma.chatRoom.update({
			where,
			data: { isDeleted: EBooleanStatus.TRUE },
		});
	}
}
