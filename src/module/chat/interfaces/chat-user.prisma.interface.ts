import { Prisma, ChatUser } from "@prisma/client";
import { IUser } from "../../user/interfaces/user.prisma.interface";

export interface IChatUser extends ChatUser {
	user: IUser;
}

export type IChatUserCreate = Prisma.ChatUserCreateInput;
export type IChatUserUpdate = Prisma.ChatUserUpdateInput;
export type IChatUserFilter = Prisma.ChatUserWhereInput;
export type IChatUserUnique = Prisma.ChatUserWhereUniqueInput;
export type IChatUserOrder = Prisma.ChatUserOrderByWithRelationInput;
