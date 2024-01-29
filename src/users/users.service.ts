import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './models/user.model'
import { UserSetting } from './models/user-setting.model'
import { Repository } from 'typeorm'
import { CreateUserInput } from './models/create-user.model'

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	getUsers() {
		return this.userRepository.find()
	}

	getUserById(id: number) {
		return this.userRepository.findOneBy({ id })
	}

	createUser(createUserData: CreateUserInput) {
		const newUser = this.userRepository.create(createUserData)
		return this.userRepository.save(newUser)
	}
}
