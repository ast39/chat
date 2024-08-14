import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { IUser } from "../interfaces/user.prisma.interface";

export class UserDto {
	public constructor(user: IUser) {
		this.userId = user.userId;
		this.userName = user.userName;
		this.userAvatar = user.userAvatar;
		this.createdAt = user.createdAt;
		this.updatedAt = user.createdAt;
	}

	@IsString()
	@Expose({ name: 'user_id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID пользователя',
		type: String,
	})
	userId: string;

	@IsString()
	@Expose({ name: 'user_name' })
	@ApiProperty({
		title: 'Имя',
		description: 'Имя пользователя',
		type: String,
	})
	userName: string;

	@IsString()
	@Expose({ name: 'user_avatar' })
	@ApiProperty({
		title: 'ID аватара',
		description: 'ID аватара',
		type: String,
		required: false,
	})
	userAvatar?: string;

	@IsDate()
	@Expose({ name: 'created_at' })
	@Exclude()
	@ApiProperty({
		title: 'Дата добавления',
		description: 'Дата добавления в БД',
		type: Date,
	})
	createdAt: Date;

	@IsDate()
	@Expose({ name: 'updated_at' })
	@Exclude()
	@ApiProperty({
		title: 'Дата обноаления',
		description: 'Дата последнего обновления',
		type: Date,
	})
	updatedAt: Date;
}
