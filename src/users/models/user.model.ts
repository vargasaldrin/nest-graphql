import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { UserSetting } from './user-setting.model'

@Entity({ name: 'users' })
@ObjectType()
export class User {
	@PrimaryGeneratedColumn()
	@Field((type) => Int)
	id: number

	@Column()
	@Field()
	username: string

	@Column({ nullable: true })
	@Field({ nullable: true })
	displayName?: string

	@OneToOne((type) => UserSetting)
	@JoinColumn()
	@Field({ nullable: true })
	settings?: UserSetting
}
