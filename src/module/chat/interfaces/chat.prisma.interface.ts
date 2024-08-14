import { Prisma, Chat } from '@prisma/client';
import { IMessage } from '../../message/interfaces/message.prisma.interface';
import { IChatUser } from './chat-user.prisma.interface';

export interface IChat extends Chat {
	users: IChatUser[];
	messages: IMessage[];
}

export type IChatCreate = Prisma.ChatCreateInput;
export type IChatUpdate = Prisma.ChatUpdateInput;
export type IChatFilter = Prisma.ChatWhereInput;
export type IChatUnique = Prisma.ChatWhereUniqueInput;
export type IChatOrder = Prisma.ChatOrderByWithRelationInput;
