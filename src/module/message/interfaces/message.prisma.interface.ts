import { Prisma, Message } from '@prisma/client';
import { IReaction } from '../../reaction/interfaces/reaction.prisma.interface';
import { IMessageAttachment } from '../../attachment/file/interfaces/message-attachment-prisma.interface';

export interface IMessage extends Message {
	reactions?: IReaction[];
	attachments?: IMessageAttachment[];
}

export type IMessageCreate = Prisma.MessageCreateInput;
export type IMessageUpdate = Prisma.MessageUpdateInput;
export type IMessageFilter = Prisma.MessageWhereInput;
export type IMessageUnique = Prisma.MessageWhereUniqueInput;
export type IMessageOrder = Prisma.MessageOrderByWithRelationInput;
