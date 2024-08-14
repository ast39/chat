import { Module } from '@nestjs/common';
import { HeicConverterService } from './heic-converter.service';
import { MovConverterService } from './mov-converter.service';
import { M4aConverterService } from './m4a-converter.service';
import { AacConverterService } from './aac-converter.service';

@Module({
	providers: [HeicConverterService, MovConverterService, M4aConverterService, AacConverterService],
	exports: [HeicConverterService, MovConverterService, M4aConverterService, AacConverterService],
})
export class ConverterModule {}
