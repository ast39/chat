import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import { UserRepository } from '../../user/user.repository';

type JwtPayload = {
	id: string;
	name: string;
	avatar: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly userRepository: UserRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		});
	}

	async validate(payload: JwtPayload) {
		let user = await this.userRepository.show(payload.id);

		if (!user) {
			try {
				user = await this.userRepository.store({
					user_id: payload.id,
					user_name: payload.name ?? '',
					user_avatar: payload.avatar ?? null,
				});
			} catch (error) {
				console.error(`Error creating user: ${error.message}`);
				throw new Error('User validation failed');
			}
		}

		return user;
	}
}
