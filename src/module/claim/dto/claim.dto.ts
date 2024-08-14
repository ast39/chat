import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EClaimStatus } from '@prisma/client';
import { IClaim } from '../interfaces/claim.prisma.interface';

export class ClaimDto {
	public constructor(claim: IClaim) {
		this.claim_id = claim.claimId;
		this.chat_id = claim.chatId;
		this.user_id = claim.userId;
		this.author_id = claim.authorId;
		this.title = claim.title;
		this.body = claim.body;
		this.status = claim.status;
		this.created = claim.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'claim_id' })
	@ApiProperty({
		title: 'ID жалобы',
		description: 'ID жалобы',
		type: Number,
		format: 'int32',
	})
	claim_id: number;

	@IsNumber()
	@Expose({ name: 'chat_id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
	})
	chat_id: number;

	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя, нарушителя',
		type: String,
	})
	user_id: string;

	@IsString()
	@Expose({ name: 'author_id' })
	@ApiProperty({
		title: 'ID автора жалобы',
		description: 'ID пользователя, создавшего жалобу',
		type: String,
	})
	author_id: string;

	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Заголовок',
		description: 'Заголовок жалобы',
		type: String,
	})
	title: string;

	@IsString()
	@Expose({ name: 'body' })
	@ApiProperty({
		title: 'Описание жалобы',
		description: 'Описание или содержание жалобы',
		type: String,
	})
	body: string;

	@IsOptional()
	@IsEnum(EClaimStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус жалобы',
		enum: EClaimStatus,
		required: false,
	})
	status: EClaimStatus;

	@IsOptional()
	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления жалобы',
		type: Date,
	})
	created: Date;
}
