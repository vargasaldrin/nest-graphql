import { Mutation, Resolver, Args, Query } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { LoginResponse } from './dto/login-response'
import { LoginUserInput } from './dto/login-user.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from './gql-auth.guard'
import { User } from 'src/users/models/user.model'
import { CreateUserInput } from 'src/users/inputs/create-user.model'

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Query(() => LoginResponse)
	@UseGuards(GqlAuthGuard)
	async loginUser(@Args('loginUserInput') loginUserInput: LoginUserInput) {
		const user = await this.authService.validateUser(
			loginUserInput.username,
			loginUserInput.password,
		)
		if (!user) {
			throw new Error('invalid credentials')
		}
		return this.authService.login(user)
	}

	@Mutation((returns) => User)
	createUser(@Args('createUserData') createUserData: CreateUserInput) {
		return this.authService.signup(createUserData)
	}
}
