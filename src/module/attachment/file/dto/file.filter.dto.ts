import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

export class FileFilterDto extends PaginationDto {
	@ApiProperty({
		title: 'Тип файла',
		description: 'Тип файла',
		type: String,
		required: false,
		default: null,
	})
	type?: string;
}
