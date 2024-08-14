import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import { IUserUnique } from './interfaces/user.prisma.interface';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { EBooleanStatus } from "../../common/enums/boolean-status.enum";

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	// Пользователь по ID
	async show(userId: string, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.findUnique({
			where: { userId: userId },
		});
	}

	// Добавить пользователя в синхро БД
	async store(data: UserCreateDto, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.create({
			data: {
				userId: data.user_id,
				userName: data.user_name || null,
				userAvatar: data.user_avatar || null,
			},
		});
	}

	// Обновить пользователя в синхро БД
	async update(
		params: {
			where: IUserUnique;
			data: UserUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<UserDto> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.user.update({
			where,
			data,
		});
	}

	// Удалить пользователя из синхро БД
	async destroy(where: IUserUnique, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.update({
			where,
			data: { isDeleted: EBooleanStatus.TRUE },
		});
	}
}
