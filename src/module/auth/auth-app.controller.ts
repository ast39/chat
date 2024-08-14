import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { IJwtToken } from '../../common/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';

@ApiExcludeController()
@ApiTags('APP: Авторизация')
@Controller('auth')
export class AuthAppController {
	constructor(private authService: AuthService) {}

	@ApiOperation({
		summary: 'Прямая авторизация в чатах (на данный момент правильно авторизовываться уже в сервисе IWM)',
	})
	@ApiOkResponse({
		description: 'Прямая авторизация в чатах (на данный момент правильно авторизовываться уже в сервисе IWM)',
		type: IJwtToken,
		isArray: false,
		status: 201,
	})
	@Post('signin')
	async registration(@Body() loginDto: LoginDto): Promise<IJwtToken> {
		return await this.authService.signIn(loginDto);
	}

	@ApiOperation({ summary: 'Получить информацию о пользователе из текущего токена' })
	@ApiOkResponse({
		description: 'Получить информацию о пользователе из текущего токена',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('me')
	async me(@JwtUser('id') userId: string): Promise<UserDto> {
		return await this.authService.me(userId);
	}
}
