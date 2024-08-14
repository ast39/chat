import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenIsAbsentException extends HttpException {
	constructor() {
		super({ message: 'Токен не был передан' }, HttpStatus.UNAUTHORIZED);
	}
}

export class TokenExpireException extends HttpException {
	constructor() {
		super({ message: 'Токен просрочен' }, HttpStatus.UNAUTHORIZED);
	}
}
