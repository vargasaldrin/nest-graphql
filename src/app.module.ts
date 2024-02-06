import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/user.module'
import { AuthModule } from './auth/auth.module'
import { NftModule } from './nft/nft.module'
import { CommentsModule } from './comments/comments.module'
import { User } from './users/models/user.model'
import { Nft } from './nft/models/nft.model'
import { Comment } from './comments/models/comment.model'
import { NftService } from './nft/nft.service'

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: 'src/schema.gql',
			context: ({ req, res }) => ({ req, res }),
			playground: {
				settings: {
					'editor.theme': 'dark',
				},
			},
		}),
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'db.sqlite',
			entities: [User, Nft, Comment],
			synchronize: true,
		}),
		AuthModule,
		UsersModule,
		NftModule,
		CommentsModule,
	],
})
export class AppModule {}
