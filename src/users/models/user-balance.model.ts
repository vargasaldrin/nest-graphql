import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserBalance {
	@Field((type) => Int)
	balance: number
}
