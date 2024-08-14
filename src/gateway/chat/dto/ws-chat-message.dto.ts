import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WsChatMessageDto {
	@IsNotEmpty()
	@IsNumber()
	chatId: number;

	@IsNotEmpty()
	@IsString()
	senderId: string;

	@IsNotEmpty()
	@IsString()
	content: string;

	@IsOptional()
	@IsNumber()
	replyTo?: number;
}
