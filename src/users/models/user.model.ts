import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Nft } from '../../nft/models/nft.model'
import { Comment } from 'src/comments/models/comment.model'

@Entity({ name: 'users' })
@ObjectType()
export class User {
	@PrimaryGeneratedColumn()
	@Field((type) => Int)
	id: number

	@Column()
	@Field()
	username: string

	@Column()
	password: string

	@Column()
	@Field()
	firstName: string

	@Column({ nullable: true })
	@Field({ nullable: true })
	lastName?: string

	@Column()
	@Field()
	admin: boolean

	@Column()
	@Field()
	softDelete: boolean

	@Column()
	@HideField()
	balance: number

	@OneToMany(() => Nft, (nft) => nft.owner)
	@Field((type) => [Nft], { nullable: true })
	nfts?: Nft[]

	@OneToMany(() => Comment, (comment) => comment.user)
	@Field((type) => [Comment], { nullable: true })
	comments?: Comment[]
}
