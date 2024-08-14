import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ChatRepository } from './chat.repository';
import { ChatUpdateDto } from './dto/chat.update.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ChatCreateDto } from './dto/chat.create.dto';
import { ChatDto } from './dto/chat.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import {
	ChatAlreadyExistException,
	ChatNotFoundException,
	ChatUserAlreadyExistException,
	ChatUserNotyExistException,
	UserNotAccessException,
} from './exceptions/chat.exceptions';
import { ChatFilterDto } from './dto/chat.filter.dto';
import { ChatRoomService } from '../chatRoom/chat-room.service';
import { IChat } from './interfaces/chat.prisma.interface';
import { ChatUserDto } from './dto/chat-user.dto';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { NetworkUserService } from '../network/user/network-user.service';
import { UserNotFoundException } from '../user/exeptions/user.exeptions';
import { MessageRepository } from '../message/message.repository';
import { ChatGateway } from '../../gateway/chat/chat.gateway';
import { NetworkTiesService } from '../network/ties/network-ties.service';

@Injectable()
export class ChatCmsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly chatRepo: ChatRepository,
		private readonly messageRepo: MessageRepository,
		private readonly chatRoomService: ChatRoomService,
		private readonly userService: UserService,
		private readonly networkUserService: NetworkUserService,
		private readonly networkTiesService: NetworkTiesService,
		private readonly chatGateway: ChatGateway,
	) {}

	// Список чатов
	async chatList(url: string, chatFilter: ChatFilterDto): Promise<PaginationInterface<ChatDto>> {
		const page = Number(chatFilter.page ?? 1);
		const limit = Number(chatFilter.limit ?? 10);

		// Список чатов
		const chats = await this.prisma.$transaction(async (tx) => {
			const where: Prisma.ChatWhereInput = {
				roomId: +chatFilter.room_id || undefined,
				title: chatFilter.title || undefined,
				status: chatFilter.status || undefined,
			};

			where.users = {
				some: { userId: chatFilter.user_id || undefined },
			};

			const chats = await this.chatRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						roomId: +chatFilter.room_id || undefined,
						title: chatFilter.title || undefined,
						status: chatFilter.status || undefined,
						users: { some: { userId: chatFilter.user_id } },
					},
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!chats.length) {
				throw new ChatNotFoundException();
			}

			return chats;
		});

		// Всего чатов
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.chatRepo.totalRows(
				{
					where: {
						roomId: +chatFilter.room_id || undefined,
						title: chatFilter.title || undefined,
						status: chatFilter.status || undefined,
					},
				},
				tx,
			);
		});

		// Ответ
		return {
			data: chats.map((chat) => new ChatDto(chat as IChat)),
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

	// Найти чат по ID
	async getChat(chatId: number): Promise<ChatDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим чат
			const chat = await this.chatRepo.show(+chatId, tx);
			if (!chat) {
				throw new ChatNotFoundException();
			}

			return new ChatDto(chat as IChat);
		});
	}

	// Добавить чат
	async createChat(data: ChatCreateDto): Promise<ChatDto> {
		return this.prisma.$transaction(async (tx) => {
			// Имя чата не может дублироваться
			const check = await this.chatRepo.totalRows({ where: { title: data.title } });
			if (check > 0) {
				throw new ChatAlreadyExistException();
			}

			// Получим комнату чата
			await this.chatRoomService.getChatRoom(data.room_id);

			// Создадим чат
			const newChat = await this.chatRepo.store(data, tx);

			return new ChatDto(newChat as IChat);
		});
	}

	// Обновить чат
	async updateChat(chatId: number, data: ChatUpdateDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим чат
			await this.getChat(+chatId);

			// Обновим чат
			await this.chatRepo.update(
				{
					where: { chatId: +chatId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Прочитать сообщения чата
	async readChatMessages(chatId: number, userId: string): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим чат
			await this.getChat(+chatId);

			// Нельзя прочитать чужие чаты
			if (!(await this.chatRepo.userInChat(+chatId, userId))) {
				throw new UserNotAccessException();
			}

			// Прочитаем сообщения
			await this.messageRepo.readMessages(+chatId, userId, tx);

			this.chatGateway.handleReadChat({
				chatId: +chatId,
				readerId: userId,
			});

			return { success: true };
		});
	}

	// Удалить чат
	async deleteChat(chatId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим чат
			await this.getChat(+chatId);

			// Удалим чат
			await this.chatRepo.destroy({ chatId: +chatId }, tx);

			return { success: true };
		});
	}

	// Удалить чат между 2мя юзерами со всеми связками
	async deleteChatBetweenPair(userId: string, partnerId: string): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Поищем чат между юзерами
			const chatId = await this.chatRepo.findChatByPair(userId, partnerId, tx);
			if (chatId) {
				// Удалим сам чат
				await this.chatRepo.destroy({ chatId: +chatId });
			}

			return { success: true };
		});
	}

	// Добавить пользователя в чат
	async attachUser(body: ChatUserDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Второй раз к одному чату присоединиться нельзя
			const check = await this.chatRepo.userChatRecord(body);
			if (check) {
				throw new ChatUserAlreadyExistException();
			}

			// Получим чат
			await this.getChat(body.chat_id);

			// Проверим пользователя в БД чатов
			const checkUser = await this.userService.checkUser(body.user_id);

			// Пробуем получить юзера из сервиса юзеров
			if (!checkUser) {
				const findUserInNetwork = await this.networkUserService.getUser(body.user_id);
				if (!findUserInNetwork) {
					throw new UserNotFoundException();
				}

				// синхронизируем юзеров в БД чатов и в сервисе юзеров
				await this.userService.createUser({
					user_id: findUserInNetwork.data.id,
					user_name: findUserInNetwork.data.name,
					user_avatar: null,
				});
			}

			// Состоит ли пользователь уже в чате?
			if (await this.chatRepo.userInChat(+body.chat_id, body.user_id, tx)) {
				throw new ChatUserAlreadyExistException();
			}

			// Прикрепим пользователя
			await this.chatRepo.attachUser(body, tx);

			return { success: true };
		});
	}

	// Удалить пользователя из чата
	async detachUser(body: ChatUserDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			const check = await this.chatRepo.userChatRecord(body);
			if (!check) {
				throw new ChatUserNotyExistException();
			}

			// Получим чат
			await this.getChat(body.chat_id);

			// Получим пользователя
			await this.userService.getUser(body.user_id);

			// Состоит ли пользователь уже в чате?
			if (!(await this.chatRepo.userInChat(+body.chat_id, body.user_id, tx))) {
				throw new ChatUserNotyExistException();
			}

			// Открепим пользователя
			await this.chatRepo.detachUser(body, tx);

			return { success: true };
		});
	}
}
