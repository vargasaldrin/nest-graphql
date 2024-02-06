import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentsService } from './comments.service'
import { CommentsResolver } from './comments.resolver'
import { Comment } from './models/comment.model'
import { NftService } from '../nft/nft.service'
import { Nft } from 'src/nft/models/nft.model'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { UsersModule } from 'src/users/user.module'
import { NftModule } from 'src/nft/nft.module'
import { UserService } from 'src/users/user.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Comment, Nft]),
		JwtModule.register({
			secret: 'me-so-secret-me-uwu',
			signOptions: { expiresIn: '86400s' },
		}),
		forwardRef(() => UsersModule),
		forwardRef(() => NftModule),
	],
	providers: [CommentsResolver, CommentsService, JwtStrategy, NftService],
	exports: [CommentsService, CommentsResolver],
})
export class CommentsModule {}
