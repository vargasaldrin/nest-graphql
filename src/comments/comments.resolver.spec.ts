import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { CommentsResolver } from './comments.resolver'
import { CommentsService } from './comments.service'
import { CreateCommentsInput } from './input/create-comment.input'
import { NftService } from '../nft/nft.service'
import { UserService } from '../users/user.service'
import { User } from '../users/models/user.model'
import { Comment } from './models/comment.model'
import { Nft } from '../nft/models/nft.model'

describe('CommentsResolver', () => {
	let commentsResolver: CommentsResolver
	let commentsService: CommentsService
	let commentsRepository: Repository<Comment>
	let fakeNftService: Partial<NftService>
	let fakeUserService: Partial<UserService>
	let mockUser: User = {
		id: 1,
		username: 'John Doe',
		password: 'testakjsdfk',
		firstName: 'John',
		lastName: 'Doe',
		admin: false,
		softDelete: false,
		balance: 200,
	}
	let mockComment = {
		id: 1,
		comment: 'test',
		userId: 1,
		nftId: 1,
	}
	let mockNft = {
		id: 1,
		url: 'http://google.com',
		title: 'test',
		description: 'descriptive test',
		category: 'love',
		price: 200,
		softDelete: false,
		ownerId: 1,
	} as Nft

	beforeEach(async () => {
		fakeNftService = {
			findOne: (id: number) => Promise.resolve({ id: 1, title: 'Test Title' } as Nft),
		}
		fakeUserService = {
			getById: (id: number) => Promise.resolve({ id: 1, username: 'John' } as User),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CommentsResolver,
				CommentsService,
				{ provide: NftService, useValue: fakeNftService },
				{
					provide: UserService,
					useValue: fakeUserService,
				},
				{
					provide: getRepositoryToken(Comment),
					useValue: {
						find: jest.fn(),
						findOneBy: jest.fn(),
						create: jest.fn(),
						update: jest.fn(),
					},
				},
			],
		}).compile()

		commentsResolver = module.get<CommentsResolver>(CommentsResolver)
		commentsService = module.get(CommentsService)
		commentsRepository = module.get(getRepositoryToken(Comment))
	})

	it('should be defined', () => {
		expect(commentsService).toBeDefined()
	})

	it('should add a comment', async () => {
		const createCommentsInput: CreateCommentsInput = {
			nftId: 1,
			comment: 'test comment',
		}
		const user = { userId: 1 }

		const checkNft = jest.spyOn(fakeNftService, 'findOne').mockResolvedValueOnce(mockNft)
		const createComment = jest.spyOn(commentsService, 'create').mockResolvedValueOnce(mockComment)

		const result = await commentsResolver.addComment(createCommentsInput, user)

		expect(checkNft).toHaveBeenCalledWith(1)
		expect(createComment).toHaveBeenCalledWith(createCommentsInput, 1)
		expect(result).toEqual({ id: 1, comment: 'test', userId: 1, nftId: 1 })
	})

	it('should return a list of comments', async () => {
		const pageNumber = 1
		const itemsPerPage = 10
		const skip = (pageNumber - 1) * itemsPerPage
		const comments = [
			{ id: 1, comment: 'comment 1', userId: 1, nftId: 1 },
			{ id: 2, comment: 'comment 2', userId: 2, nftId: 2 },
			{ id: 3, comment: 'comment 3', userId: 3, nftId: 3 },
		]
		const findAllSpy = jest.spyOn(commentsService, 'findAll').mockResolvedValueOnce(comments)

		const result = await commentsResolver.viewCommentList(pageNumber)

		expect(findAllSpy).toHaveBeenCalledWith(skip, itemsPerPage)
		expect(result).toEqual(comments)
	})

	it('should return a list of comments', async () => {
		const pageNumber = 1
		const itemsPerPage = 10
		const skip = (pageNumber - 1) * itemsPerPage
		const comments = [
			{ id: 1, comment: 'comment 1', userId: 1, nftId: 1 },
			{ id: 2, comment: 'comment 2', userId: 2, nftId: 2 },
			{ id: 3, comment: 'comment 3', userId: 3, nftId: 3 },
		]
		const findAllSpy = jest.spyOn(commentsService, 'findAll').mockResolvedValueOnce(comments)

		const result = await commentsResolver.viewCommentList(pageNumber)

		expect(findAllSpy).toHaveBeenCalledWith(skip, itemsPerPage)
		expect(result).toEqual(comments)
	})

	it('should update a comment', async () => {
		const id = 1
		const comment = 'updated comment'
		const user = { userId: 1 }

		const findOneSpy = jest.spyOn(commentsService, 'findOne').mockResolvedValueOnce(mockComment)
		const updateSpy = jest.spyOn(commentsService, 'update').mockResolvedValueOnce(mockComment)

		const result = await commentsResolver.updateComment(id, comment, user)

		expect(findOneSpy).toHaveBeenCalledWith(id)
		expect(updateSpy).toHaveBeenCalledWith(id, comment)
		expect(result).toEqual(mockComment)
	})

	it('should throw an error if comment is not found', async () => {
		const id = 1
		const comment = 'updated comment'
		const user = { userId: 1 }

		jest.spyOn(commentsService, 'findOne').mockResolvedValueOnce(null)

		await expect(commentsResolver.updateComment(id, comment, user)).rejects.toThrowError(
			'Comment not found',
		)
	})

	it('should throw an error if user is not the owner of the comment', async () => {
		const id = 1
		const comment = 'updated comment'
		const user = { userId: 2 }

		jest.spyOn(commentsService, 'findOne').mockResolvedValueOnce(mockComment)

		await expect(commentsResolver.updateComment(id, comment, user)).rejects.toThrowError(
			'You are not the owner of this comment',
		)
	})

	it('should remove a comment', async () => {
		const id = 1
		const removeSpy = jest.spyOn(commentsService, 'remove').mockResolvedValueOnce(null)

		const result = await commentsResolver.removeComment(id)

		expect(removeSpy).toHaveBeenCalledWith(id)
		expect(result).toEqual(null)
	})
})
