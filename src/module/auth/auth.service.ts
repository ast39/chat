import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { UserNotFoundException } from '../user/exeptions/user.exeptions';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	// Дэмо токен (данный токен будет возвращаться из сервиса авторизации до вызова данного АПИ)
	async signIn(login: LoginDto) {
		// получим юзера по ID
		const user = await this.userService.getUser(login.user_id);

		// Создадим на него токен
		return await this.generateTokens({
			user_id: user.userId,
			user_name: user.userName,
			user_avatar: user.userAvatar,
		});
	}

	// Информация об авторизованном пользователе
	async me(userId: string): Promise<UserDto> {
		const user = await this.userService.getUser(userId);
		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	// Сгенерировать токены
	private async generateTokens(user: { user_id: string; user_name: string; user_avatar: string }) {
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync(
				{
					id: user.user_id,
					name: user.user_name,
					avatar: user.user_avatar,
				},
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
					expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRED'),
				},
			),
			this.jwtService.signAsync(
				{
					id: user.user_id,
					name: user.user_name,
					avatar: user.user_avatar,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
				},
			),
		]);

		return {
			access_token,
			refresh_token,
		};
	}
}
