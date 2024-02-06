import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class CreateCommentsInput {
	@Field()
	comment: string

	@Field((type) => Int)
	nftId: number
}
