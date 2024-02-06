import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	firstName?: string

	@Field({ nullable: true })
	lastName?: string

	@Field({ nullable: true })
	balance?: number
}
