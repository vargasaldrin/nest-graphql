import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './models/user.model'
import { Repository } from 'typeorm'
import { CreateUserInput } from './inputs/create-user.model'
import { UpdateUserInput } from './inputs/update-user.model'

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	getAll() {
		return this.userRepository.find()
	}

	getById(id: number) {
		return this.userRepository.findOneBy({ id })
	}

	getByName(username: string) {
		return this.userRepository.findOneBy({ username })
	}

	create(createUserData: CreateUserInput) {
		const newUser = this.userRepository.create(createUserData)
		return this.userRepository.save(newUser)
	}

	async updateData(id: number, updateUserData: UpdateUserInput) {
		await this.userRepository.update(id, updateUserData)
		return this.userRepository.findOneBy({ id })
	}

	async delete(id: number) {
		await this.userRepository.update(id, { softDelete: true })
		const user = await this.userRepository.findOneBy({ id })

		return user
	}

	async recover(id: number) {
		await this.userRepository.update(id, { softDelete: false })
		const user = await this.userRepository.findOneBy({ id })

		return user
	}
}
