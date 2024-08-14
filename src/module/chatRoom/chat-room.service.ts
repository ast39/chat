import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoomUpdateDto } from './dto/chat-room.update.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ChatRoomCreateDto } from './dto/chat-room.create.dto';
import { ChatRoomDto } from './dto/chat-room.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatRoomAlreadyExistException, ChatRoomNotFoundException } from './exceptions/chat-room.exceptions';
import { ChatRoomFilterDto } from './dto/chat-room.filter.dto';
import { IChatRoom } from './interfaces/chat-room.prisma.interface';

@Injectable()
export class ChatRoomService {
	constructor(
		private prisma: PrismaService,
		private chatRoomRepo: ChatRoomRepository,
	) {}

	// Список комнат
	async chatRoomList(url: string, chatRoomFilter: ChatRoomFilterDto): Promise<PaginationInterface<ChatRoomDto>> {
		const page = Number(chatRoomFilter.page ?? 1);
		const limit = Number(chatRoomFilter.limit ?? 10);

		const chatRooms = await this.prisma.$transaction(async (tx) => {
			// Список комнат
			const chatRooms = await this.chatRoomRepo.index(
				{
					skip: (page - 1) * limit,
					where: {},
					take: limit,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!chatRooms.length) {
				throw new ChatRoomNotFoundException();
			}

			return chatRooms;
		});

		// Общее кол-во комнат
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.chatRoomRepo.totalRows(
				{
					where: {},
				},
				tx,
			);
		});

		// Ответ с пагинацией
		return {
			data: chatRooms.map((chatRoom) => new ChatRoomDto(chatRoom as IChatRoom)),
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

	// Найти комнату по ID
	async getChatRoom(ChatRoomId: number): Promise<ChatRoomDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим комнату
			const chatRoom = await this.chatRoomRepo.show(ChatRoomId, tx);
			if (!chatRoom) {
				throw new ChatRoomNotFoundException();
			}

			return new ChatRoomDto(chatRoom as IChatRoom);
		});
	}

	// Добавить комнату
	async createChatRoom(data: ChatRoomCreateDto): Promise<ChatRoomDto> {
		return this.prisma.$transaction(async (tx) => {
			// Название комнат не может дублироваться
			const check = await this.chatRoomRepo.totalRows({ where: { title: data.title } });
			if (check > 0) {
				throw new ChatRoomAlreadyExistException();
			}

			// Создадим комнату
			const newChatRoom = await this.chatRoomRepo.store(data, tx);

			return new ChatRoomDto(newChatRoom as IChatRoom);
		});
	}

	// Обновить комнату
	async updateChatRoom(chatRoomId: number, data: ChatRoomUpdateDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим комнату
			await this.getChatRoom(chatRoomId);

			// Обновим комнату
			await this.chatRoomRepo.update(
				{
					where: { roomId: +chatRoomId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Удалить комнату
	async deleteChatRoom(chatRoomId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим комнату
			await this.getChatRoom(chatRoomId);

			// Удалим комнату
			await this.chatRoomRepo.destroy({ roomId: +chatRoomId }, tx);

			return { success: true };
		});
	}
}
