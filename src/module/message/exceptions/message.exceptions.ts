import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Сообщение не найдено' }, HttpStatus.NOT_FOUND);
	}
}

export class MessageNotYourException extends HttpException {
	constructor() {
		super({ message: 'Это чужое сообщение' }, HttpStatus.BAD_REQUEST);
	}
}
