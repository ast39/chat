import { Body, Controller, Param, Get, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiExcludeController,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ClaimCreateDto } from './dto/claim.create.dto';
import { ClaimDto } from './dto/claim.dto';
import { ClaimService } from './claim.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../../common/decorators/user.decorator';

@ApiTags('APP: Жалобы')
@ApiExcludeController()
@Controller('claim')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClaimAppController {
	constructor(private claimService: ClaimService) {}

	@Get(':claim_id')
	@ApiOperation({
		summary: 'Жалоба по ID',
		description: 'Получить информацию о жалобе',
	})
	@ApiOkResponse({
		description: 'Информация о жалобе',
		type: ClaimDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('claim_id') claimId: number): Promise<ClaimDto> {
		return await this.claimService.getClaim(claimId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление жалобы',
		description: 'Добавление жалобы на пользователя',
	})
	@ApiResponse({
		description: 'Добавленная жалоба',
		type: ClaimDto,
		isArray: false,
		status: 201,
	})
	public async create(@JwtUser('id') userId: string, @Body() body: ClaimCreateDto): Promise<ClaimDto> {
		return await this.claimService.createClaim(body, userId);
	}
}
