import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PrimaryColumn, Column, Entity } from 'typeorm'

@Entity({ name: 'user_settings' })
@ObjectType()
export class UserSetting {
	@PrimaryColumn()
	@Field((type) => Int)
	userId: number

	@Column()
	@Field({ defaultValue: false })
	receiveNotifications: boolean

	@Column()
	@Field({ defaultValue: false })
	receiveEmails: boolean
}
