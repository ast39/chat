import { Prisma, Reaction } from '@prisma/client';

export interface IReaction extends Reaction {}

export type IReactionCreate = Prisma.ReactionCreateInput;
export type IReactionUpdate = Prisma.ReactionUpdateInput;
export type IReactionFilter = Prisma.ReactionWhereInput;
export type IReactionUnique = Prisma.ReactionWhereUniqueInput;
export type IReactionOrder = Prisma.ReactionOrderByWithRelationInput;
