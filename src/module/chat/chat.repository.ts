import { Injectable } from "@nestjs/common";
import { IPrismaTR, PrismaService } from "../../prisma";
import { IChat, IChatFilter, IChatOrder, IChatUnique } from "./interfaces/chat.prisma.interface";
import { ChatUpdateDto } from "./dto/chat.update.dto";
import { ChatCreateDto } from "./dto/chat.create.dto";
import { Chat, ChatUser, EChatStatus } from "@prisma/client";
import { ChatUserDto } from "./dto/chat-user.dto";
import { EBooleanStatus } from "../../common/enums/boolean-status.enum";

@Injectable()
export class ChatRepository {
	constructor(private prisma: PrismaService) {}

	// Всего чатов без пагинации
	async totalRows(
		params: {
			cursor?: IChatUnique;
			where?: IChatFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		where.isDeleted = EBooleanStatus.FALSE;

		return prisma.chat.count({
			cursor,
			where,
		});
	}

	// Список чатов
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IChatFilter;
			orderBy?: IChatOrder;
		},
		tx?: IPrismaTR,
	): Promise<Chat[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		where.isDeleted = EBooleanStatus.FALSE;

		return prisma.chat.findMany({
			skip,
			take,
			where,
			include: {
				messages: {
					take: 1,
					orderBy: { createdAt: 'desc' },
					include: {
						reactions: true,
						attachments: { include: { attachment: true } },
					},
					where: { isDeleted: EBooleanStatus.FALSE },
				},
				users: { include: { user: true } },
			},
			orderBy,
		});
	}

	// Чат по ID
	async show(chatId: number, tx?: IPrismaTR): Promise<Chat> {
		const prisma = tx ?? this.prisma;

		return prisma.chat.findUnique({
			where: { chatId: chatId, isDeleted: EBooleanStatus.FALSE },
			include: {
				messages: {
					include: {
						reactions: true,
						attachments: { include: { attachment: true } },
					},
					where: { isDeleted: EBooleanStatus.FALSE },
					orderBy: { createdAt: 'desc' },
				},
				users: { include: { user: true } },
			},
		});
	}

	// Найти чат по ID двух юзеров
	async findChatByPair(userId: string, partnerId: string, tx?: IPrismaTR): Promise<number> {
		const prisma = tx ?? this.prisma;

		const user1Chats = await prisma.chatUser.findMany({
			where: { userId: userId },
			select: { chatId: true },
		});

		const chatIds = user1Chats.map((chatUser) => chatUser.chatId);
		if (chatIds.length === 0) return null;

		return prisma.chatUser
			.findFirst({
				where: {
					chatId: { in: chatIds },
					userId: partnerId,
				},
				select: { chatId: true },
			})
			.then((chat) => chat?.chatId);
	}

	// Является ли пользователь участников чата?
	async userInChat(chatId: number, userId: string, tx?: IPrismaTR): Promise<ChatUser> {
		const prisma = tx ?? this.prisma;

		return prisma.chatUser.findUnique({
			where: {
				chatId_userId: {
					chatId: chatId,
					userId: userId!,
				},
			},
		});
	}

	// Добавить чат
	async store(data: ChatCreateDto, tx?: IPrismaTR): Promise<Chat> {
		const prisma = tx ?? this.prisma;

		return prisma.chat.create({
			data: {
				roomId: +data.room_id,
				title: data.title,
				status: data.status || EChatStatus.ACTIVE,
			},
		});
	}

	// Обновить чат
	async update(
		params: {
			where: IChatUnique;
			data: ChatUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<Chat> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.chat.update({
			where,
			data,
		});
	}

	// Удалить чат
	async destroy(where: IChatUnique, tx?: IPrismaTR): Promise<Chat> {
		const prisma = tx ?? this.prisma;

		return prisma.chat.delete({ where });
	}

	// Запись участия пользователя в чате
	async userChatRecord(body: ChatUserDto, tx?: IPrismaTR): Promise<ChatUser> {
		const prisma = tx ?? this.prisma;

		return prisma.chatUser.findFirst({
			where: {
				chatId: +body.chat_id,
				userId: body.user_id,
			},
		});
	}

	// Добавление пользователя в чат
	async attachUser(body: ChatUserDto, tx?: IPrismaTR): Promise<ChatUser> {
		const prisma = tx ?? this.prisma;

		return prisma.chatUser.create({
			data: {
				chatId: +body.chat_id,
				userId: body.user_id,
			},
		});
	}

	// Удаление пользователя из чата
	async detachUser(body: ChatUserDto, tx?: IPrismaTR): Promise<ChatUser> {
		const prisma = tx ?? this.prisma;

		return prisma.chatUser.delete({
			where: { chatId_userId: { chatId: +body.chat_id, userId: body.user_id } },
		});
	}
}
