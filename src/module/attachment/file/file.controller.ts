import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileDto } from './dto/file.dto';
import { IActionInterface } from '../../../common/interfaces/action.interface';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Вложения')
@Controller('attachment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
	constructor(private fileService: FileService) {}

	@Post('upload')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Загрузить файл в облако',
		description: 'Загрузить файл в облако',
	})
	@ApiOkResponse({
		description: 'Информация о файле',
		type: FileDto,
		isArray: true,
		status: 201,
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('file'))
	public async uploadFile(@UploadedFile('file') file: Express.Multer.File): Promise<FileDto> {
		return this.fileService.upload(file);
	}

	@Delete(':file_key')
	@ApiOperation({
		summary: 'Удалить файл из облака',
		description: 'Удалить файл из облака',
	})
	@ApiOkResponse({
		description: 'Рузультат действия',
		type: IActionInterface,
		status: 200,
	})
	public async deleteFile(@Param('file_key') fileKey: string): Promise<IActionInterface> {
		return this.fileService.delete(fileKey);
	}

	@Get(':file_key')
	@ApiOperation({
		summary: 'Информация о файле',
		description: 'Информация о файле',
	})
	@ApiOkResponse({
		description: 'Информация о файле',
		type: FileDto,
		isArray: false,
		status: 200,
	})
	public async fetchFile(@Param('file_key') fileKey: string): Promise<FileDto> {
		return this.fileService.fetch(fileKey);
	}

	@Get('image/:file_key')
	@ApiOperation({
		summary: 'Получить изображение',
		description: 'Получить изображение',
	})
	@ApiOkResponse({
		description: 'Стрим изображения',
		type: String,
		isArray: false,
		status: 200,
	})
	public async showImage(@Param('file_key') fileKey: string, @Res() res: Response): Promise<any> {
		try {
			const fileBuffer = await this.fileService.showImage(fileKey);
			const { type, buffer } = fileBuffer;

			res.setHeader('Content-Type', type);
			res.send(buffer);
		} catch (error) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
	}

	@Get('audio/:file_key')
	@ApiOperation({
		summary: 'Получить аудио',
		description: 'Получить аудио',
	})
	@ApiOkResponse({
		description: 'Стрим аудио',
		type: String,
		isArray: false,
		status: 200,
	})
	async showAudio(@Param('file_key') fileKey: string, @Res() res: Response): Promise<any> {
		try {
			const fileBuffer = await this.fileService.showAudio(fileKey);
			const { type, buffer } = fileBuffer;

			res.setHeader('Content-Type', type);
			res.send(buffer);
		} catch (error) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
	}

	@Get('video/:file_key')
	@ApiOperation({
		summary: 'Получить видео',
		description: 'Получить видео',
	})
	@ApiOkResponse({
		description: 'Стрим видео',
		type: String,
		isArray: false,
		status: 200,
	})
	async showVideo(@Param('file_key') fileKey: string, @Res() res: Response): Promise<any> {
		try {
			const fileBuffer = await this.fileService.showAudio(fileKey);
			const { type, buffer } = fileBuffer;

			res.setHeader('Content-Type', type);
			res.send(buffer);
		} catch (error) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
	}
}
