import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from 'src/users/models/user.model'
import { Nft } from 'src/nft/models/nft.model'

@Entity({ name: 'comment' })
@ObjectType()
export class Comment {
	@PrimaryGeneratedColumn()
	@Field((type) => Int)
	id: number

	@Column()
	@Field()
	comment: string

	@Column()
	@Field((type) => Int)
	nftId: number

	@Column()
	@Field((type) => Int)
	userId: number

	@ManyToOne(() => User, (user) => user.comments)
	@Field((type) => User, { nullable: true })
	user?: User

	@ManyToOne(() => Nft, (nft) => nft.comments)
	@Field((type) => Nft, { nullable: true })
	nft?: Nft
}
