import { HttpException, HttpStatus } from '@nestjs/common';

export class ChatRoomNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Комната чата не найдена' }, HttpStatus.NOT_FOUND);
	}
}

export class ChatRoomAlreadyExistException extends HttpException {
	constructor() {
		super({ message: 'Комната чата с таким названием уже существует' }, HttpStatus.NOT_FOUND);
	}
}
