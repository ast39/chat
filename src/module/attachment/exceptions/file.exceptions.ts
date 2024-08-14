import { HttpException, HttpStatus } from '@nestjs/common';

export class FileNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Файл не найден' }, HttpStatus.NOT_FOUND);
	}
}

export class FileUploadErrorException extends HttpException {
	constructor() {
		super({ message: 'Ошибка при загрузке файла на сервер' }, HttpStatus.NOT_FOUND);
	}
}
