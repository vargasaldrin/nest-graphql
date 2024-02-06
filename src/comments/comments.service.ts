import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CreateCommentsInput } from './input/create-comment.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from './models/comment.model'
import { Nft } from 'src/nft/models/nft.model'
import { NftService } from '../nft/nft.service'
import { User } from 'src/users/models/user.model'
import { UserService } from 'src/users/user.service'

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(Comment) private commentsRepository: Repository<Comment>,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		@Inject(forwardRef(() => NftService))
		private nftService: NftService,
	) {}

	create(createCommentsInput: CreateCommentsInput, userId: number) {
		const newComment = this.commentsRepository.create({ ...createCommentsInput, userId })
		return this.commentsRepository.save(newComment)
	}

	findAll(skip: number, take: number) {
		return this.commentsRepository.find({ skip, take })
	}

	findOne(id: number) {
		return this.commentsRepository.findOneBy({ id })
	}

	async filter(userId: number) {
		const commentsResult = await this.commentsRepository.find({
			where: { userId },
		})
		return commentsResult
	}

	async update(id: number, comment: string) {
		await this.commentsRepository.update(id, { comment })

		return this.commentsRepository.findOneBy({ id })
	}

	async remove(id: number) {
		const deleteResult = await this.commentsRepository.delete(id)
		if (deleteResult.affected === 0) {
			throw new Error(`No comment found with the id ${id}`)
		}

		return { result: `Comment with id ${id} has been deleted successfully` }
	}

	findUser(userId: number): Promise<User> {
		return this.userService.getById(userId)
	}

	findNft(nftId: number): Promise<Nft> {
		return this.nftService.findOne(nftId)
	}
}
