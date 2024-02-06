import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Repository, Not } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateNftInput } from './input/create-nft.input'
import { UpdateNftInput } from './input/update-nft.input'
import { NftSortInput } from './input/sort-nft.input'
import { Nft } from './models/nft.model'
import { UserService } from 'src/users/user.service'
import { User } from 'src/users/models/user.model'
import { Comment } from 'src/comments/models/comment.model'
import { CommentsService } from 'src/comments/comments.service'

@Injectable()
export class NftService {
	constructor(
		@InjectRepository(Nft) private nftRepository: Repository<Nft>,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		@Inject(forwardRef(() => CommentsService))
		private commentsService: CommentsService,
	) {}

	create(createNftInput: CreateNftInput, userId: number) {
		const newNft = this.nftRepository.create({ ...createNftInput, ownerId: userId })
		return this.nftRepository.save(newNft)
	}

	filter(filter: Partial<Nft>, skip: number, take: number, sort: any) {
		return this.nftRepository.find({
			where: { softDelete: Not(true), ...filter },
			skip,
			take,
			order: {
				[sort.field]: sort.order,
			},
		})
	}

	findAll(skip: number, take: number) {
		return this.nftRepository.find({ skip, take })
	}

	findOne(id: number) {
		return this.nftRepository.findOneBy({ id })
	}

	async update(id: number, updateNftInput: UpdateNftInput) {
		const test = await this.nftRepository.update(id, updateNftInput)
		return this.nftRepository.findOneBy({ id })
	}

	async remove(id: number) {
		await this.nftRepository.update(id, { softDelete: true })

		return this.nftRepository.findOneBy({ id })
	}

	async recover(id: number) {
		await this.nftRepository.update(id, { softDelete: false })

		return this.nftRepository.findOneBy({ id })
	}

	findOwner(userId: number): Promise<User> {
		return this.userService.getById(userId)
	}

	findComments(nftId: number): Promise<Comment[]> {
		return this.commentsService.filter(nftId)
	}
}
