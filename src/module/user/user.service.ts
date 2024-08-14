import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { UserAlreadyExistException, UserNotFoundException } from './exeptions/user.exeptions';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { IUser } from './interfaces/user.prisma.interface';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private userRepo: UserRepository,
	) {}

	// Получить пользователя по ID
	async getUser(userId: string): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.userRepo.show(userId, tx);
			if (!user) {
				throw new UserNotFoundException();
			}

			return new UserDto(user);
		});
	}

	async checkUser(userId: string): Promise<boolean> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.userRepo.show(userId, tx);
			return !!user;
		});
	}

	// Добавить пользователя в синхро БД
	async createUser(data: UserCreateDto): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.userRepo.show(data.user_id);

			// Пользователь с таким же ID не может дублироваться
			if (user) {
				throw new UserAlreadyExistException();
			}

			// Добавим пользователя
			const newUser = await this.userRepo.store(data, tx);

			return new UserDto(newUser as IUser);
		});
	}

	// Обновить пользователя в БД
	async updateUser(userId: string, data: UserUpdateDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Проверим пользователя
			await this.getUser(userId);

			// Обновим пользователя
			await this.userRepo.update(
				{
					where: { userId: userId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Удалить пользователя из синхро БД
	async deleteUser(userId: string): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Проверим пользователя
			await this.getUser(userId);

			// Удалим пользователя
			await this.userRepo.destroy({ userId: userId }, tx);

			return { success: true };
		});
	}
}
