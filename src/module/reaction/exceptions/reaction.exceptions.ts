import { HttpException, HttpStatus } from '@nestjs/common';

export class ReactionNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Реакция не найдена' }, HttpStatus.NOT_FOUND);
	}
}

export class ReactionNotYourException extends HttpException {
	constructor() {
		super({ message: 'Это чужая реакция' }, HttpStatus.NOT_FOUND);
	}
}
