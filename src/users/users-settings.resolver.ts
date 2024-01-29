import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UserSetting } from './models/user-setting.model'
import { CreateUserSettingsInput } from './models/create-user-settings.model'
import { UserSettingService } from './users-settings.service'

@Resolver()
export class UserSettingsResolver {
	constructor(private userSettingService: UserSettingService) {}
	@Mutation((returns) => UserSetting)
	async createUserSettings(
		@Args('createUserSettingsData')
		createUserSettingsData: CreateUserSettingsInput,
	) {
		const userSetting = await this.userSettingService.createUserSetting(createUserSettingsData)
		return userSetting
	}
}
