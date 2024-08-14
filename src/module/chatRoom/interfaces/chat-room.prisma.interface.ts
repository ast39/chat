import { Prisma, ChatRoom } from '@prisma/client';
import { IChat } from '../../chat/interfaces/chat.prisma.interface';

export interface IChatRoom extends ChatRoom {
	chats: IChat[];
}

export type IChatRoomCreate = Prisma.ChatRoomCreateInput;
export type IChatRoomUpdate = Prisma.ChatRoomUpdateInput;
export type IChatRoomFilter = Prisma.ChatRoomWhereInput;
export type IChatRoomUnique = Prisma.ChatRoomWhereUniqueInput;
export type IChatRoomOrder = Prisma.ChatRoomOrderByWithRelationInput;
