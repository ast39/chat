import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthAppController } from './auth-app.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		UserModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_ACCESS_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthAppController],
	providers: [AuthService, UserService, UserRepository, ConfigService, AccessTokenStrategy, RefreshTokenStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
