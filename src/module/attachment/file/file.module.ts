import { Module } from '@nestjs/common';
import { ConverterModule } from '../converter/converter.module';
import { S3Module } from '../s3/s3.module';
import { FileService } from './file.service';
import { FileRepository } from './file.repository';
import { FilesController } from './file.controller';

@Module({
	imports: [ConverterModule, S3Module],
	controllers: [FilesController],
	providers: [FileService, FileRepository],
	exports: [FileService, FileRepository],
})
export class FileModule {}
