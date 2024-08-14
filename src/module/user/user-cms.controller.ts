import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/roles.guard';

@ApiExcludeController()
@ApiTags('CMS: Пользователи')
@Controller('cms/user')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class UserCmsController {
	constructor(private userService: UserService) {}

	@ApiOperation({ summary: 'Вручную перенсти пользователя из IWM в чаты по UUID' })
	@ApiOkResponse({
		description:
			'Вручную перенсти пользователя из IWM в чаты по UUID (это будет происходить автоматом по токену авторизвции)',
		type: UserDto,
		isArray: false,
		status: 201,
	})
	@Post('')
	@HttpCode(HttpStatus.CREATED)
	async addUser(@Body() userData: UserCreateDto): Promise<UserDto> {
		return this.userService.createUser(userData);
	}
}
