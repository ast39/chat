import { HttpException, HttpStatus } from '@nestjs/common';

export class AttachmentNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Вложение не найдено' }, HttpStatus.NOT_FOUND);
	}
}
