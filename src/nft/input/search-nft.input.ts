import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsUrl, IsInt } from 'class-validator'

@InputType()
export class NftSearchInput {
	@Field({ nullable: true })
	@IsUrl()
	@IsOptional()
	url?: string

	@Field({ nullable: true })
	@IsOptional()
	title?: string

	@Field({ nullable: true })
	@IsOptional()
	description?: string

	@Field({ nullable: true })
	@IsOptional()
	category?: string

	@Field(() => Int, { nullable: true })
	@IsInt()
	@IsOptional()
	price?: number
}
