import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { IMessageFilter, IMessageOrder, IMessageUnique } from './interfaces/message.prisma.interface';
import { MessageUpdateDto } from './dto/message.update.dto';
import { MessageAppCreateDto } from './dto/message-app.create.dto';
import { Message, EMessageStatus } from '@prisma/client';
import { EBooleanStatus } from '../../common/enums/boolean-status.enum';
@Injectable()
export class MessageRepository {
	constructor(private prisma: PrismaService) {}

	// Всего сообщений без пагинации
	async totalRows(params: { cursor?: IMessageUnique; where?: IMessageFilter }, tx?: IPrismaTR): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;
		where.isDeleted = EBooleanStatus.FALSE;

		return prisma.message.count({ cursor, where });
	}

	// Список сообщений
	async index(
		params: { skip?: number; take?: number; where?: IMessageFilter; orderBy?: IMessageOrder },
		tx?: IPrismaTR,
	): Promise<Message[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;
		where.isDeleted = EBooleanStatus.FALSE;

		return prisma.message.findMany({ skip, take, where, include: { reactions: true }, orderBy });
	}

	// Сообщение по ID
	async show(messageId: number, tx?: IPrismaTR): Promise<Message> {
		const prisma = tx ?? this.prisma;

		return prisma.message.findUnique({
			where: { messageId: +messageId, isDeleted: EBooleanStatus.FALSE },
			include: {
				reactions: true,
				attachments: { include: { attachment: true } },
			},
		});
	}

	// Добавить сообщение
	async store(userId: string, data: MessageAppCreateDto, tx?: IPrismaTR): Promise<Message> {
		const prisma = tx ?? this.prisma;

		const message = await prisma.message.create({
			data: {
				chatId: +data.chat_id,
				replyToId: +data.reply_to || null,
				userId: userId,
				content: data.content ?? '',
				status: data.status || EMessageStatus.ACTIVE,
			},
		});

		// Если есть вложения (files), то записываем их в таблицу MessageAttachment
		if (data.files && data.files.length > 0) {
			for (const file of data.files) {
				await prisma.messageAttachment.create({
					data: {
						messageId: message.messageId,
						attachmentId: file,
					},
				});
			}
		}

		return message;
	}

	// Обновить сообщение
	async update(params: { where: IMessageUnique; data: MessageUpdateDto }, tx?: IPrismaTR): Promise<Message> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;

		return prisma.message.update({ where, data });
	}

	// Прочитать сообщения чата
	async readMessages(chatId: number, userId: string, tx?: IPrismaTR): Promise<number> {
		const prisma = tx ?? this.prisma;
		const result = await prisma.message.updateMany({
			where: { chatId: chatId, NOT: { userId: userId } },
			data: { isRead: 1 },
		});

		return result.count;
	}

	// Удалить сообщение (мягкое удаление)
	async destroy(where: IMessageUnique, tx?: IPrismaTR): Promise<Message> {
		const prisma = tx ?? this.prisma;

		return prisma.message.update({
			where,
			data: { isDeleted: EBooleanStatus.TRUE },
		});
	}
}
