import { CreateCommentsInput } from './create-comment.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateCommentsInput {
	@Field(() => Int)
	id: number

	@Field()
	comment: string
}
