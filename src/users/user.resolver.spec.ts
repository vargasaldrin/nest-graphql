import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { User } from './models/user.model'
import { Nft } from '../nft/models/nft.model'
import { Comment } from '../comments/models/comment.model'
import { CreateUserInput } from '../users/inputs/create-user.model'
import { NftService } from '../nft/nft.service'
import { CommentsService } from 'src/comments/comments.service'
import { UserResolver } from './user.resolver'
import { Repository } from 'typeorm'

describe('UserResolver', () => {
	let userService: UserService
	let userResolver: UserResolver
	let userRepository: Repository<User>
	let fakeNftService: Partial<NftService>
	let fakeCommentService: Partial<CommentsService>
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
	let mockId = 1

	beforeEach(async () => {
		fakeNftService = {
			filter: (nft: Nft) => Promise.resolve([{ id: 1, title: 'test' }] as [Nft]),
		}
		fakeCommentService = {
			filter: (userId: number) => Promise.resolve([{ id: 1, comment: 'test' }] as [Comment]),
		}

		const module = await Test.createTestingModule({
			providers: [
				UserService,
				UserResolver,
				{ provide: NftService, useValue: fakeNftService },
				{
					provide: CommentsService,
					useValue: fakeCommentService,
				},
				{
					provide: getRepositoryToken(User),
					useValue: {
						find: jest.fn(),
						findOneBy: jest.fn(),
						create: jest.fn(),
						update: jest.fn(),
					},
				},
			],
		}).compile()

		userService = module.get(UserService)
		userRepository = module.get<Repository<User>>(getRepositoryToken(User))
		userResolver = module.get<UserResolver>(UserResolver)
	})

	it('can create an instance of user service', async () => {
		expect(userService).toBeDefined()
	})

	it('should get user by id', async () => {
		jest.spyOn(userService, 'getById').mockResolvedValue(mockUser)

		const result = await userResolver.getUserById(mockId)

		expect(userService.getById).toHaveBeenCalledWith(mockId)
		expect(result).toEqual(mockUser)
	})

	it('should get user balance', async () => {
		jest.spyOn(userService, 'getById').mockResolvedValue(mockUser)

		const result = await userResolver.getBalance({ userId: mockId })

		expect(userService.getById).toHaveBeenCalledWith(mockId)
		expect(result).toEqual({ balance: mockUser.balance })
	})

	it('should get all users', async () => {
		jest.spyOn(userService, 'getAll').mockResolvedValue([mockUser])

		const result = await userResolver.getUsers()

		expect(userService.getAll).toHaveBeenCalled()
		expect(result).toEqual([mockUser])
	})

	it('should update user profile', async () => {
		const updateUserInput = {
			username: 'John Doe',
			password: 'testakjsdfk',
			firstName: 'John',
			lastName: 'Doe',
		}
		const user = { userId: mockId }

		jest.spyOn(userService, 'updateData').mockResolvedValue(mockUser)

		const result = await userResolver.updateUserProfile(updateUserInput, user)

		expect(userService.updateData).toHaveBeenCalledWith(mockId, updateUserInput)
		expect(result).toEqual(mockUser)
	})

	it('should get user by id', async () => {
		jest.spyOn(userService, 'getById').mockResolvedValue(mockUser)

		const result = await userResolver.whoAmI({ userId: mockId })

		expect(userService.getById).toHaveBeenCalledWith(mockId)
		expect(result).toEqual(mockUser)
	})

	it('should delete user', async () => {
		const user = { userId: mockId }
		const mockAdmin = { ...mockUser, admin: true }
		jest.spyOn(userService, 'getById').mockResolvedValue(mockAdmin)
		jest.spyOn(userService, 'delete').mockResolvedValue(mockUser)

		const result = await userResolver.deleteUser(mockId, user)

		expect(userService.getById).toHaveBeenCalledWith(mockId)
		expect(userService.delete).toHaveBeenCalledWith(mockId)
		expect(result).toEqual(mockUser)
	})
})
