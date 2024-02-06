import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../users/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../users/models/user.model'
import { CreateUserInput } from 'src/users/inputs/create-user.model'

describe('AuthService', () => {
	let service: AuthService
	let fakeUsersService: Partial<UserService>

	beforeEach(async () => {
		//create fake copy of users service
		fakeUsersService = {
			getByName: (name: string) => Promise.resolve(null as User),
			create: (CreateUserInput: {
				username: string
				password: string
				firstName: string
				lastName?: string
				admin: boolean
				softDelete: boolean
				balance: number
			}) =>
				Promise.resolve({
					id: 1,
					username: 'name',
					password: 'test',
				} as User),
		}

		const module = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UserService, useValue: fakeUsersService },
				{
					provide: JwtService,
					useValue: {
						sign: () => 'test_token',
					},
				},
			],
		}).compile()

		service = module.get(AuthService)
	})

	it('can create an instance of auth service', async () => {
		expect(service).toBeDefined()
	})

	it('creates a new user with a salted and hashed password', async () => {
		const user = await service.signup({
			username: 'testing',
			password: 'testOnly',
			firstName: 'name',
			admin: false,
			softDelete: false,
			balance: 0,
		})
		expect(user.password).not.toEqual('asdfasdfasdf')
	})

	it('throws an error if user signs up with username that is in use', async () => {
		fakeUsersService.getByName = () =>
			Promise.resolve({ id: 1, username: 'a', password: '1' } as User)
		await expect(service.signup({ username: 'a', password: 'asdf' } as User)).rejects.toThrow(
			Error,
		)
	})

	it('throws an error if validateUser is called with an softDeleted username', async () => {
		fakeUsersService.getByName = () =>
			Promise.resolve({ id: 1, username: 'a', password: '1', softDelete: true } as User)
		await expect(service.validateUser('a', 'asdf')).rejects.toThrow(Error)
	})

	it('returns a token if the correct username and password are passed', async () => {
		fakeUsersService.getByName = () =>
			Promise.resolve({ id: 1, username: 'a', password: 'asdf' } as User)
		const token = await service.login({ username: 'a', password: 'asdf' } as User)
		expect(token).toBeDefined()
	})
})
