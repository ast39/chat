import { HttpException, HttpStatus } from '@nestjs/common';

export const UploadFilter = (req, file, callback) => {
	if (file.size / 1000000 > 500) {
		return callback(new HttpException('Допустимый размер всех файла 500Мб', HttpStatus.BAD_REQUEST), false);
	}
	if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp|mov|mp4|heic|mp3|m4a|aac)$/)) {
		return callback(
			new HttpException(
				'Допустимые форматы файлов: jpeg, jpg, png, gif, svg, webp, heic, mov, mp4, heic, mp3, m4a, aac',
				HttpStatus.BAD_REQUEST,
			),
			false,
		);
	}
	callback(null, true);
};
