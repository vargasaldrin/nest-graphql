import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

@InputType()
export class CreateUserInput {
	@Field()
	username: string

	@Field()
	password: string

	@Field()
	firstName: string

	@Field({ nullable: true })
	lastName?: string

	@Field({ defaultValue: false })
	admin: boolean

	@Field({ defaultValue: false })
	softDelete: boolean

	@Field((type) => Int, { defaultValue: 10000 })
	balance: number
}
