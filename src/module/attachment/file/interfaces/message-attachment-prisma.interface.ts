import { Prisma, MessageAttachment } from '@prisma/client';
import { IAttachment } from './attachment-prisma.interface';

export interface IMessageAttachment extends MessageAttachment {
	attachment?: IAttachment;
}

export type IMessageAttachmentCreate = Prisma.MessageAttachmentCreateInput;
export type IMessageAttachmentUpdate = Prisma.MessageAttachmentUpdateInput;
export type IMessageAttachmentFilter = Prisma.MessageAttachmentWhereInput;
export type IMessageAttachmentUnique = Prisma.MessageAttachmentWhereUniqueInput;
export type IMessageAttachmentOrder = Prisma.MessageAttachmentOrderByWithRelationInput;
