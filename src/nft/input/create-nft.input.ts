import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateNftInput {
	@Field((type) => String)
	url: string

	@Field()
	title: string

	@Field()
	description: string

	@Field()
	category: string

	@Field((type) => Int, { defaultValue: 100 })
	price: number

	@Field({ nullable: true, defaultValue: false })
	softDelete: boolean
}
