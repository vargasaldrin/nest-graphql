import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql'
import { IsOptional, IsIn, IsEnum } from 'class-validator'

export enum SortType {
	ASCENDING = 'ASC',
	DESCENDING = 'DESC',
}

registerEnumType(SortType, {
	name: 'SortType', // this one is mandatory
	description: 'choose sort direction', // the description is optional
})

@InputType()
export class NftSortInput {
	@Field({ nullable: true })
	@IsOptional()
	field?: string

	@Field((type) => SortType, { nullable: true })
	@IsEnum(SortType)
	@IsOptional()
	order?: SortType | undefined
}
