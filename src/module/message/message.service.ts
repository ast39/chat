import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MessageRepository } from './message.repository';
import { MessageUpdateDto } from './dto/message.update.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { MessageAppCreateDto } from './dto/message-app.create.dto';
import { MessageDto } from './dto/message.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageNotFoundException, MessageNotYourException } from './exceptions/message.exceptions';
import { MessageFilterDto } from './dto/message.filter.dto';
import { ChatCmsService } from '../chat/chat-cms.service';
import { IMessage } from './interfaces/message.prisma.interface';
import { MessageVersionService } from '../messageVersion/message-version.service';
import { ChatGateway } from '../../gateway/chat/chat.gateway';
import { Prisma } from '@prisma/client';
import { MessageCmsCreateDto } from './dto/message-cms.create.dto';
import { ChatAppService } from '../chat/chat-app.service';

@Injectable()
export class MessageService {
	constructor(
		private prisma: PrismaService,
		private messageRepo: MessageRepository,
		private chatAppService: ChatAppService,
		private chatCmsService: ChatCmsService,
		@Inject(forwardRef(() => MessageVersionService))
		private messageVersionService: MessageVersionService,
		private readonly chatGateway: ChatGateway,
	) {}

	// Список сообщений
	async messageList(
		url: string,
		messageFilter: MessageFilterDto,
		userId?: string,
	): Promise<PaginationInterface<MessageDto>> {
		const page = Number(messageFilter.page ?? 1);
		const limit = Number(messageFilter.limit ?? 10);

		// Список сообщений
		const messages = await this.prisma.$transaction(async (tx) => {
			const where: Prisma.MessageWhereInput = {
				chatId: +messageFilter.chat_id || undefined,
				userId: userId ?? (messageFilter.user_id || undefined),
				status: messageFilter.status || undefined,
			};

			if (userId) {
				where.userId = userId;
			} else {
				where.userId = messageFilter.user_id || undefined;
			}

			const messages = await this.messageRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						chatId: +messageFilter.chat_id || undefined,
						userId: userId ?? (messageFilter.user_id || undefined),
						status: messageFilter.status || undefined,
					},
					orderBy: { createdAt: 'asc' },
				},
				tx,
			);

			if (!messages.length) {
				throw new MessageNotFoundException();
			}

			return messages;
		});

		// Всего сообщений
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.messageRepo.totalRows(
				{
					where: {
						chatId: +messageFilter.chat_id || undefined,
						userId: userId ?? (messageFilter.user_id || undefined),
						status: messageFilter.status || undefined,
					},
				},
				tx,
			);
		});

		// Ответ
		return {
			data: messages.map((message) => new MessageDto(message as IMessage)),
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

	// Найти сообщение по ID
	async getMessage(messageId: number, userId?: string): Promise<MessageDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим сообщение
			const message = await this.messageRepo.show(messageId, tx);
			if (!message) {
				throw new MessageNotFoundException();
			}

			// Если читает конкретный пользователь, проверим, что это его сообщение
			if (userId && message.userId !== userId) {
				throw new MessageNotYourException();
			}

			return new MessageDto(message as IMessage);
		});
	}

	// Добавить сообщение из CMS
	async createMessageFromCms(data: MessageCmsCreateDto): Promise<MessageDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.chatCmsService.getChat(data.chat_id);

			// Если это ответ на другое сообщение, получим его
			if (data.reply_to !== null) {
				await this.getMessage(data.reply_to);
			}

			// Создадим сообщение
			const newMessage = await this.messageRepo.store(data.author_id, data, tx);

			this.chatGateway.handleSyncMessage({
				chatId: +newMessage.chatId,
				senderId: newMessage.userId,
				content: newMessage.content ?? null,
				replyTo: newMessage.replyToId ?? null,
			});

			return new MessageDto(newMessage as IMessage);
		});
	}

	// Добавить сообщение из приложения
	async createMessageFromApp(data: MessageAppCreateDto, userId: string): Promise<MessageDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.chatAppService.getChat(data.chat_id, userId);
			// Если это ответ на другое сообщение, получим его
			if (data.reply_to) {
				await this.getMessage(data.reply_to);
			}

			// Создадим сообщение
			const newMessage = await this.messageRepo.store(userId, data, tx);

			this.chatGateway.handleSyncMessage({
				chatId: +newMessage.chatId,
				senderId: newMessage.userId,
				content: newMessage.content ?? null,
				replyTo: newMessage.replyToId ?? null,
			});

			return new MessageDto(newMessage as IMessage);
		});
	}

	// Обновить сообщение
	async updateMessage(messageId: number, data: MessageUpdateDto, userId?: string): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим текущее состояние сообщения
			const currentVersion = await this.getMessage(+messageId, userId);

			// Нельзя удалить чужое сообщение
			if (userId && currentVersion.user_id !== userId) {
				throw new MessageNotYourException();
			}

			// Отправить текущее сообщение в историю
			await this.messageVersionService.createMessageVersion({
				message_id: +currentVersion.message_id,
				content: currentVersion.content,
			});

			// Обновить текушее сообшение
			await this.messageRepo.update(
				{
					where: { messageId: +messageId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Удалить сообщение
	async deleteMessage(messageId: number, userId?: string): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим сообщение
			const message = await this.getMessage(messageId, userId);

			// Нельзя удалить чужое сообщение
			if (userId && message.user_id !== userId) {
				throw new MessageNotYourException();
			}

			// Удалим сообщение
			await this.messageRepo.destroy({ messageId: +messageId }, tx);

			return { success: true };
		});
	}
}
