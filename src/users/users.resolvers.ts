import { Args, Query, Resolver, Int, ResolveField, Parent, Mutation } from '@nestjs/graphql'
import { User } from './models/user.model'
import { UserSetting } from './models/user-setting.model'
import { CreateUserInput } from './models/create-user.model'
import { UserService } from './users.service'
import { UserSettingService } from './users-settings.service'

export let incrementalId = 3

@Resolver((of) => User)
export class UserResolver {
	constructor(
		private userService: UserService,
		private userSettingService: UserSettingService,
	) {}

	@Query((returns) => User, { nullable: true })
	getUserById(@Args('id', { type: () => Int }) id: number) {
		return this.userService.getUserById(id)
	}

	@Query((returns) => [User])
	getUsers() {
		return this.userService.getUsers()
	}

	@ResolveField((returns) => UserSetting, { name: 'settings', nullable: true })
	getUserSettings(@Parent() user: User) {
		return this.userSettingService.getUserSettingById(user.id)
	}

	@Mutation((returns) => User)
	createUser(@Args('createUserData') createUserData: CreateUserInput) {
		return this.userService.createUser(createUserData)
	}
}
