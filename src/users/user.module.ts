import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './models/user.model'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { NftModule } from 'src/nft/nft.module'
import { CommentsModule } from 'src/comments/comments.module'
import { NftService } from 'src/nft/nft.service'
import { CommentsService } from 'src/comments/comments.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		forwardRef(() => NftModule),
		forwardRef(() => CommentsModule),
	],
	providers: [AuthService, UserResolver, UserService, JwtService],
	exports: [UserService, UserResolver],
})
export class UsersModule {}
