import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './models/user.model'
import { UserSetting } from './models/user-setting.model'
import { CreateUserSettingsInput } from './models/create-user-settings.model'

@Injectable()
export class UserSettingService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(UserSetting)
		private userSettingRepository: Repository<UserSetting>,
	) {}

	getUserSettingById(userId: number) {
		return this.userSettingRepository.findOneBy({ userId })
	}

	async createUserSetting(createUserSettingData: CreateUserSettingsInput) {
		const findUser = await this.userRepository.findOneBy({
			id: createUserSettingData.userId,
		})

		if (!findUser) throw new Error('User not found')

		const newUserSetting = this.userSettingRepository.create(createUserSettingData)
		const saveSettings = this.userSettingRepository.save(newUserSetting)

		findUser.settings = newUserSetting
		await this.userRepository.save(findUser)

		return saveSettings
	}
}
