import { Injectable } from '@nestjs/common'
import { UserService } from '../users/user.service'
import { CreateUserInput } from '../users/inputs/create-user.model'
import { User } from 'src/users/models/user.model'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.userService.getByName(username)
		if (user.softDelete) throw new Error('User is blocked')

		const validatePass = await bcrypt.compare(pass, user.password)
		if (user && validatePass) {
			return user
		}

		return null
	}

	async signup(createUserData: CreateUserInput) {
		const user = await this.userService.getByName(createUserData.username)
		if (user) {
			throw new Error('user already exists')
		}

		const password = await bcrypt.hash(createUserData.password, 10)

		return this.userService.create({ ...createUserData, password })
	}

	async login(user: User) {
		return {
			access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
			user,
		}
	}
}
