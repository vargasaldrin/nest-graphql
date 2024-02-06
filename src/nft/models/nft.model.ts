import { ObjectType, Field, Int } from '@nestjs/graphql'
import {
	Column,
	Entity,
	JoinColumn,
	PrimaryGeneratedColumn,
	OneToOne,
	ManyToOne,
	OneToMany,
} from 'typeorm'
import { IsUrl } from 'class-validator'
import { User } from '../../users/models/user.model'
import { Comment } from '../../comments/models/comment.model'

@Entity({ name: 'nft' })
@ObjectType()
export class Nft {
	@PrimaryGeneratedColumn()
	@Field((type) => Int)
	id: number

	@Column()
	@Field()
	@IsUrl()
	url: string

	@Column()
	@Field()
	title: string

	@Column()
	@Field()
	description: string

	@Column()
	@Field()
	category: string

	@Column()
	@Field((type) => Int)
	price: number

	@Column()
	softDelete: boolean

	@Column()
	@Field((type) => Int)
	ownerId: number

	@ManyToOne(() => User, (user) => user.nfts)
	@Field((type) => User)
	owner?: User

	@OneToMany(() => Comment, (comment) => comment.nft)
	@Field((type) => [Comment], { nullable: true })
	comments: Comment[]
}
