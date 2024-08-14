import { HttpException, HttpStatus } from '@nestjs/common';

export class ClaimNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Жалоба не найдена' }, HttpStatus.NOT_FOUND);
	}
}
