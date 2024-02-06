import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { NftService } from './nft.service'
import { UserService } from 'src/users/user.service'
import { Nft } from './models/nft.model'
import { User } from 'src/users/models/user.model'
import { CreateNftInput } from './input/create-nft.input'
import { NftSearchInput } from './input/search-nft.input'
import { NftSortInput } from './input/sort-nft.input'
import { UpdateNftInput } from './input/update-nft.input'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CurrentUser } from 'src/users/user.decorator'
import { Comment } from 'src/comments/models/comment.model'
import { PaginateNftInput } from './input/paginate-nft.input'

@Resolver(() => Nft)
export class NftResolver {
	constructor(
		private nftService: NftService,
		private userService: UserService,
	) {}

	@Mutation(() => Nft)
	@UseGuards(JwtAuthGuard)
	async buyNft(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: any) {
		const nftResult = await this.nftService.findOne(id)
		if (nftResult.softDelete) throw new Error('NFT is deleted')
		if (nftResult.ownerId === user.userId) throw new Error('You are the owner of this NFT')

		const userResult = await this.userService.getById(user.userId)
		if (userResult.balance < nftResult.price) throw new Error('Insufficient balance')

		const buyerNewBalance = userResult.balance - nftResult.price
		const sellerNewBalance = userResult.balance + nftResult.price
		await this.userService.updateData(user.userId, { balance: buyerNewBalance })
		await this.userService.updateData(nftResult.ownerId, { balance: sellerNewBalance })

		return this.nftService.update(id, { ownerId: user.userId })
	}

	@Mutation(() => Nft)
	@UseGuards(JwtAuthGuard)
	createNft(@Args('createNftInput') createNftInput: CreateNftInput, @CurrentUser() user: any) {
		const isValidUrl = (urlString) => {
			try {
				return Boolean(new URL(urlString))
			} catch (e) {
				return false
			}
		}
		if (!isValidUrl(createNftInput.url)) {
			throw new Error('Invalid URL')
		}

		return this.nftService.create(createNftInput, user.userId)
	}

	@Mutation(() => Nft)
	@UseGuards(JwtAuthGuard)
	async deleteNft(@Args('id') id: number, @CurrentUser() user: any) {
		const nftResult = await this.nftService.findOne(id)
		const userResult = await this.userService.getById(user.userId)

		if (nftResult.ownerId !== user.userId && !userResult.admin) {
			throw new Error('You are not the owner of this NFT')
		}
		if (nftResult.softDelete) {
			throw new Error('NFT is already deleted')
		}

		return this.nftService.remove(id)
	}

	@Mutation(() => Nft)
	@UseGuards(JwtAuthGuard)
	async recoverNft(@Args('id') id: number, @CurrentUser() user: any) {
		const nftResult = await this.nftService.findOne(id)
		const userResult = await this.userService.getById(user.userId)

		if (nftResult.ownerId !== user.userId && !userResult.admin) {
			throw new Error('You are not the owner of this NFT')
		}
		if (!nftResult.softDelete) {
			throw new Error('NFT is already available for use')
		}

		return this.nftService.recover(id)
	}

	@Query(() => [Nft])
	@UseGuards(JwtAuthGuard)
	searchNft(
		@Args('search', { type: () => NftSearchInput }) search: NftSearchInput,
		@Args('sort', { type: () => NftSortInput, nullable: true }) sort: NftSortInput | undefined,
		@Args('paginate', {
			type: () => PaginateNftInput,
			defaultValue: { pageNumber: 1, itemLimit: 10, offSet: 0 },
		})
		paginate: PaginateNftInput,
	) {
		const { pageNumber, itemLimit, offSet } = paginate
		const newSort = sort ? sort : { field: 'id', order: 'ASC' }
		const skip = (pageNumber - 1) * itemLimit + offSet

		return this.nftService.filter(search, skip, itemLimit, newSort)
	}

	@Query(() => [Nft])
	@UseGuards(JwtAuthGuard)
	getNftList(@Args('pageNumber', { type: () => Int, defaultValue: 1 }) pageNumber: number) {
		if (pageNumber < 1) throw new Error('Page number must be greater than 0')
		const itemsPerPage = 10
		const skip = (pageNumber - 1) * itemsPerPage

		return this.nftService.findAll(skip, itemsPerPage)
	}

	@Query(() => Nft)
	@UseGuards(JwtAuthGuard)
	getNft(@Args('id', { type: () => Int }) id: number) {
		return this.nftService.findOne(id)
	}

	@Mutation(() => Nft)
	@UseGuards(JwtAuthGuard)
	updateNft(@Args('id') id: number, @Args('updateNftInput') updateNftInput: UpdateNftInput) {
		return this.nftService.update(id, updateNftInput)
	}

	@Mutation(() => Nft)
	@UseGuards(JwtAuthGuard)
	async removeNft(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: any) {
		const nftResult = await this.nftService.findOne(id)
		const userResult = await this.userService.getById(user.userId)
		if (nftResult.ownerId !== user.userId && !userResult.admin)
			throw new Error('You are not the owner of this NFT')

		return this.nftService.remove(id)
	}

	@ResolveField(() => User)
	owner(@Parent() nft: Nft): Promise<User> {
		return this.nftService.findOwner(nft.ownerId)
	}

	@ResolveField(() => Comment)
	comments(@Parent() nft: Nft): Promise<Comment[]> {
		return this.nftService.findComments(nft.id)
	}
}
