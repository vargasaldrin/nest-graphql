import { InputType, Int, Field } from '@nestjs/graphql'
import { Min, Max } from 'class-validator'

@InputType()
export class PaginateNftInput {
	@Field((type) => Int, { nullable: true, defaultValue: 0 })
	@Min(0)
	offSet?: number

	@Field((type) => Int, { nullable: true, defaultValue: 1 })
	@Min(1)
	pageNumber?: number

	@Field((type) => Int, { nullable: true, defaultValue: 1 })
	@Min(1)
	@Max(20)
	itemLimit?: number
}
