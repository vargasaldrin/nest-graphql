import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { NftService } from 'src/nft/nft.service'
import { Comment } from './models/comment.model'
import { CreateCommentsInput } from './input/create-comment.input'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CurrentUser } from 'src/users/user.decorator'
import { User } from 'src/users/models/user.model'
import { Nft } from 'src/nft/models/nft.model'

@Resolver((of) => Comment)
export class CommentsResolver {
	constructor(
		private commentsService: CommentsService,
		private nftService: NftService,
	) {}

	@Mutation(() => Comment)
	@UseGuards(JwtAuthGuard)
	async addComment(
		@Args('createCommentsInput') createCommentsInput: CreateCommentsInput,
		@CurrentUser() user: any,
	) {
		const checkNft = await this.nftService.findOne(createCommentsInput.nftId)
		if (!checkNft) {
			throw new Error('NFT not found')
		}
		return this.commentsService.create(createCommentsInput, user.userId)
	}

	@Query(() => [Comment])
	@UseGuards(JwtAuthGuard)
	viewCommentList(@Args('pageNumber', { type: () => Int, defaultValue: 1 }) pageNumber: number) {
		if (pageNumber < 1) throw new Error('Page number must be greater than 0')
		const itemsPerPage = 10
		const skip = (pageNumber - 1) * itemsPerPage

		return this.commentsService.findAll(skip, itemsPerPage)
	}

	@Mutation(() => Comment)
	@UseGuards(JwtAuthGuard)
	async updateComment(
		@Args('id') id: number,
		@Args('comment') comment: string,
		@CurrentUser() user: any,
	) {
		const checkComment = await this.commentsService.findOne(id)
		if (!checkComment) throw new Error('Comment not found')
		if (checkComment.userId !== user.userId)
			throw new Error('You are not the owner of this comment')

		return this.commentsService.update(id, comment)
	}

	@Mutation(() => Comment)
	@UseGuards(JwtAuthGuard)
	removeComment(@Args('id', { type: () => Int }) id: number) {
		return this.commentsService.remove(id)
	}

	@ResolveField(() => User)
	user(@Parent() comment: Comment): Promise<User> {
		return this.commentsService.findUser(comment.userId)
	}

	@ResolveField(() => Nft)
	nft(@Parent() comment: Comment): Promise<Nft> {
		return this.commentsService.findNft(comment.nftId)
	}
}
