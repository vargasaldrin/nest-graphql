import { Args, Query, Mutation, Resolver, Int, Parent, ResolveField } from '@nestjs/graphql'
import { User } from './models/user.model'
import { UserService } from './user.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserBalance } from './models/user-balance.model'
import { CurrentUser } from './user.decorator'
import { UpdateUserInput } from './inputs/update-user.model'
import { CommentsService } from 'src/comments/comments.service'
import { NftService } from 'src/nft/nft.service'
import { Nft } from 'src/nft/models/nft.model'
import { Comment } from 'src/comments/models/comment.model'

@Resolver((of) => User)
export class UserResolver {
	constructor(
		private userService: UserService,
		private nftService: NftService,
		private commentsService: CommentsService,
	) {}

	@Query((returns) => User, { nullable: true })
	@UseGuards(JwtAuthGuard)
	async getUserById(@Args('id', { type: () => Int }) id: number) {
		const userById = await this.userService.getById(id)

		return userById
	}

	@Query((returns) => UserBalance, { nullable: true })
	@UseGuards(JwtAuthGuard)
	async getBalance(@CurrentUser() user: any) {
		const result = await this.userService.getById(user.userId)

		return { balance: result.balance }
	}

	@Query((returns) => [User])
	@UseGuards(JwtAuthGuard)
	async getUsers() {
		return this.userService.getAll()
	}

	@Mutation((returns) => User)
	@UseGuards(JwtAuthGuard)
	async updateUserProfile(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
		@CurrentUser() user: any,
	) {
		return this.userService.updateData(user.userId, updateUserInput)
	}

	@Query((returns) => User)
	@UseGuards(JwtAuthGuard)
	whoAmI(@CurrentUser() user: any) {
		return this.userService.getById(user.userId)
	}

	@Mutation((returns) => User)
	@UseGuards(JwtAuthGuard)
	async deleteUser(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: any) {
		const userResult = await this.userService.getById(user.userId)
		if (!userResult.admin) throw new Error('You are not an admin')

		return this.userService.delete(id)
	}

	@Mutation((returns) => User)
	@UseGuards(JwtAuthGuard)
	async recoverUser(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: any) {
		const userResult = await this.userService.getById(user.userId)
		if (!userResult.admin) throw new Error('You are not an admin')

		return this.userService.recover(id)
	}

	@ResolveField(() => User)
	comments(@Parent() comment: Comment): Promise<Comment[]> {
		return this.commentsService.filter(comment.userId)
	}

	@ResolveField(() => Nft)
	nfts(@Parent() nft: Nft): Promise<Nft[]> {
		const skip = 0
		const take = null
		const sort = { field: 'id', order: 'ASC' }
		const filter = { ownerId: nft.ownerId }

		return this.nftService.filter(filter, skip, take, sort)
	}
}
