import { HttpException, HttpStatus } from '@nestjs/common';

export class ChatNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Чат не найден' }, HttpStatus.NOT_FOUND);
	}
}

export class ChatAlreadyExistException extends HttpException {
	constructor() {
		super({ message: 'Чат с таким названием уже существует' }, HttpStatus.NOT_FOUND);
	}
}

export class ChatUserAlreadyExistException extends HttpException {
	constructor() {
		super({ message: 'Пользователь уже состоит в этом чате' }, HttpStatus.NOT_FOUND);
	}
}

export class ChatUserNotyExistException extends HttpException {
	constructor() {
		super({ message: 'Пользователь не состоит в этом чате' }, HttpStatus.NOT_FOUND);
	}
}

export class ChatUserNotExistException extends HttpException {
	constructor() {
		super({ message: 'Вы не можете прочитать чат, в котором не состоите' }, HttpStatus.NOT_FOUND);
	}
}

export class UserNotAccessException extends HttpException {
	constructor() {
		super({ message: 'У Вас нет прав на выполнение этого действия' }, HttpStatus.NOT_FOUND);
	}
}
