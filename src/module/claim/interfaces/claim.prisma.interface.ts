import { Prisma, Claim } from '@prisma/client';

export interface IClaim extends Claim {}

export type IClaimCreate = Prisma.ClaimCreateInput;
export type IClaimUpdate = Prisma.ClaimUpdateInput;
export type IClaimFilter = Prisma.ClaimWhereInput;
export type IClaimUnique = Prisma.ClaimWhereUniqueInput;
export type IClaimOrder = Prisma.ClaimOrderByWithRelationInput;
