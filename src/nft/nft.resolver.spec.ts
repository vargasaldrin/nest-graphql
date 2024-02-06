import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NftResolver } from './nft.resolver'
import { NftService } from './nft.service'
import { CommentsService } from '../comments/comments.service'
import { UserService } from '../users/user.service'
import { User } from '../users/models/user.model'
import { Nft } from './models/nft.model'
import { UpdateUserInput } from '../users/inputs/update-user.model'
import { NftSearchInput } from './input/search-nft.input'
import { NftSortInput } from './input/sort-nft.input'
import { mock } from 'node:test'

describe('NftResolver', () => {
	let resolver: NftResolver
	let service: NftService
	let nftRepository: Repository<Nft>
	let fakeUserService: Partial<UserService>
	let fakeCommentService: Partial<CommentsService>
	const mockNft = {
		id: 1,
		url: 'http://google.com',
		title: 'test',
		description: 'descriptive test',
		category: 'love',
		price: 200,
		softDelete: false,
		ownerId: 1,
	} as Nft
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

	beforeEach(async () => {
		fakeUserService = {
			getById: (id: number) => Promise.resolve({ id: 1, username: 'John' } as User),
			updateData: (id: number, updateUserData: UpdateUserInput) =>
				Promise.resolve({ id: 1, username: 'John' } as User),
		}
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NftResolver,
				NftService,
				{ provide: UserService, useValue: fakeUserService },
				{ provide: CommentsService, useValue: fakeCommentService },
				{
					provide: getRepositoryToken(Nft),
					useValue: {
						create: jest.fn(),
						filter: jest.fn(),
						findAll: jest.fn(),
						findOne: jest.fn(),
						update: jest.fn(),
						remove: jest.fn(),
						recover: jest.fn(),
						findOwner: jest.fn(),
						findComments: jest.fn(),
					},
				},
			],
		}).compile()

		resolver = module.get<NftResolver>(NftResolver)
		service = module.get(NftService)
		nftRepository = module.get<Repository<Nft>>(getRepositoryToken(Nft))
	})

	it('should be defined', () => {
		expect(resolver).toBeDefined()
	})

	it('should create an NFT', async () => {
		const user = { userId: 2 }

		jest.spyOn(service, 'create').mockResolvedValue(mockNft)

		const result = await resolver.createNft(mockNft, user)

		expect(service.create).toHaveBeenCalledWith(mockNft, user.userId)
		expect(result).toEqual(mockNft)
	})

	it('should delete an NFT', async () => {
		const id = 1
		const user = { userId: 1 }

		jest.spyOn(service, 'findOne').mockResolvedValue(mockNft)
		jest.spyOn(fakeUserService, 'getById').mockResolvedValue(mockUser)
		jest.spyOn(service, 'remove').mockResolvedValue(mockNft)

		const result = await resolver.deleteNft(id, user)

		expect(service.findOne).toHaveBeenCalledWith(id)
		expect(fakeUserService.getById).toHaveBeenCalledWith(user.userId)
		expect(service.remove).toHaveBeenCalledWith(id)
		expect(result).toEqual(mockNft)
	})

	it('should throw an error if the user is not the owner of the NFT', async () => {
		const id = 1
		const user = { userId: 2 }

		jest.spyOn(service, 'findOne').mockResolvedValue(mockNft)
		jest.spyOn(fakeUserService, 'getById').mockResolvedValue(mockUser)

		await expect(resolver.deleteNft(id, user)).rejects.toThrowError(
			'You are not the owner of this NFT',
		)
	})

	it('should throw an error if the NFT is already deleted', async () => {
		const id = 1
		const user = { userId: 1 }

		jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockNft, softDelete: true })
		jest.spyOn(fakeUserService, 'getById').mockResolvedValue(mockUser)

		await expect(resolver.deleteNft(id, user)).rejects.toThrowError('NFT is already deleted')
	})

	it('should recover an NFT', async () => {
		const id = 1
		const user = { userId: 1 }

		jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockNft, softDelete: true })
		jest.spyOn(fakeUserService, 'getById').mockResolvedValue(mockUser)
		jest.spyOn(service, 'recover').mockResolvedValue(mockNft)

		const result = await resolver.recoverNft(id, user)

		expect(service.findOne).toHaveBeenCalledWith(id)
		expect(fakeUserService.getById).toHaveBeenCalledWith(user.userId)
		expect(service.recover).toHaveBeenCalledWith(id)
		expect(result).toEqual(mockNft)
	})

	it('should throw an error if the user is not the owner of the NFT', async () => {
		const id = 1
		const user = { userId: 2 }

		jest.spyOn(service, 'findOne').mockResolvedValue(mockNft)
		jest.spyOn(fakeUserService, 'getById').mockResolvedValue(mockUser)

		await expect(resolver.recoverNft(id, user)).rejects.toThrowError(
			'You are not the owner of this NFT',
		)
	})

	it('should throw an error if the NFT is not soft deleted', async () => {
		const id = 1
		const user = { userId: 1 }

		jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockNft, softDelete: false })
		jest.spyOn(fakeUserService, 'getById').mockResolvedValue(mockUser)

		await expect(resolver.recoverNft(id, user)).rejects.toThrowError(
			'NFT is already available for use',
		)
	})

	it('should get all NFTs', async () => {
		const skip = 0
		const take = 10
		const pageNumber = 1

		jest.spyOn(service, 'findAll').mockResolvedValue([mockNft])

		const result = await resolver.getNftList(pageNumber)

		expect(service.findAll).toHaveBeenCalledWith(skip, take)
		expect(result).toEqual([mockNft])
	})

	it('should search for NFTs', async () => {
		const search = { title: 'test' } as NftSearchInput
		const paginate = { pageNumber: 1, itemLimit: 10, offSet: 0 }
		const skip = 0
		const take = 10
		const sort = { field: 'id', order: 'ASC' } as NftSortInput

		jest.spyOn(service, 'filter').mockResolvedValue([mockNft])

		const result = await resolver.searchNft(search, sort, paginate)

		expect(service.filter).toHaveBeenCalledWith(search, skip, take, sort)
		expect(result).toEqual([mockNft])
	})

	it('should an NFT by id', async () => {
		const id = 1

		jest.spyOn(service, 'findOne').mockResolvedValue(mockNft)

		const result = await resolver.getNft(id)

		expect(service.findOne).toHaveBeenCalledWith(id)
		expect(result).toEqual(mockNft)
	})

	it('should update an NFT', async () => {
		const id = 1
		const updateNftInput = { title: 'new title' }

		jest.spyOn(service, 'update').mockResolvedValue(mockNft)

		const result = await resolver.updateNft(id, updateNftInput)

		expect(service.update).toHaveBeenCalledWith(id, updateNftInput)
		expect(result).toEqual(mockNft)
	})

	// it('should remove an NFT', async () => {
	//
	// 	const id = 1
	// 	const user = { userId: 1 }

	// 	jest.spyOn(service, 'remove').mockResolvedValue(mockNft)

	//
	// 	const result = await resolver.removeNft(id, user)

	//
	// 	expect(service.remove).toHaveBeenCalledWith(id)
	// 	expect(result).toEqual(mockNft)
	// })
})
