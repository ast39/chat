import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IReaction } from '../interfaces/reaction.prisma.interface';

export class ReactionDto {
	public constructor(reaction: IReaction) {
		this.reaction_id = reaction.reactionId;
		this.message_id = reaction.messageId;
		this.user_id = reaction.userId;
		this.content = reaction.content;
		this.created = reaction.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'reaction_id' })
	@ApiProperty({
		title: 'ID реакции',
		description: 'ID реакции',
		type: Number,
		format: 'int32',
	})
	reaction_id: number;

	@IsNumber()
	@Expose({ name: 'message_id' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
	})
	message_id: number;

	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя, нарушителя',
		type: String,
	})
	user_id: string;

	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Код реакции',
		description: 'Код реакции',
		type: String,
	})
	content: string;

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
