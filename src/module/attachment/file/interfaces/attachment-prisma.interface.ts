import { Prisma, Attachment } from '@prisma/client';

export interface IAttachment extends Attachment {}

export type IAttachmentCreate = Prisma.AttachmentCreateInput;
export type IAttachmentUpdate = Prisma.AttachmentUpdateInput;
export type IAttachmentFilter = Prisma.AttachmentWhereInput;
export type IAttachmentUnique = Prisma.AttachmentWhereUniqueInput;
export type IAttachmentOrder = Prisma.AttachmentOrderByWithRelationInput;
