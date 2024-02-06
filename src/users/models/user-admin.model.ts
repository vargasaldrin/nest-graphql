import { Field, Int, ObjectType, Directive } from '@nestjs/graphql'
import { Expose, Exclude } from 'class-transformer'
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { User } from './user.model'

@ObjectType()
export class AdminUser extends User {
	@Field()
	balance: number
}
