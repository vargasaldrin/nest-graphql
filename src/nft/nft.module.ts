import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Nft } from './models/nft.model'
import { Comment } from 'src/comments/models/comment.model'
import { NftService } from './nft.service'
import { NftResolver } from './nft.resolver'
import { UsersModule } from 'src/users/user.module'
import { UserService } from 'src/users/user.service'
import { CommentsModule } from 'src/comments/comments.module'
import { CommentsService } from 'src/comments/comments.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Nft]),
		forwardRef(() => UsersModule),
		forwardRef(() => CommentsModule),
	],
	providers: [NftResolver, NftService],
	exports: [NftService, NftResolver],
})
export class NftModule {}
