import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NoTokenFoundException, TokenNotValidException } from '../exceptions/http-error-exception';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { ERoles } from '../enums/admin.enum';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const request = ctx.switchToHttp().getRequest();
		const token = request.headers.authorization?.replace('Bearer ', '');

		if (!token) {
			throw new NoTokenFoundException();
		}

		const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
		if (decodedToken.id && decodedToken.id === ERoles.Admin) {
			return true;
		} else {
			throw new TokenNotValidException();
		}
	}
}
