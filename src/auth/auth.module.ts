import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { LocalStrategy } from './local.strategy'
import { UsersModule } from 'src/users/user.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { NftModule } from 'src/nft/nft.module'

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: 'me-so-secret-me-uwu',
			signOptions: { expiresIn: '86400s' },
		}),
		UsersModule,
	],
	providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
