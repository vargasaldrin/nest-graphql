import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './models/user.model'
import { UserResolver } from './users.resolvers'
import { UserSettingsResolver } from './users-settings.resolver'
import { UserService } from './users.service'
import { UserSetting } from './models/user-setting.model'
import { UserSettingService } from './users-settings.service'

@Module({
	imports: [TypeOrmModule.forFeature([User, UserSetting])],
	providers: [UserResolver, UserService, UserSettingsResolver, UserSettingService],
})
export class UsersModule {}
