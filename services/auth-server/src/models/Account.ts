import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
} from 'typeorm';
import {
  Field,
  ObjectType,
  ID,
} from 'type-graphql';
import {
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import {
  ALL_ROLES,
  ROLES_ENUM,
} from '../lib/constants/permissions';
import { IsOptional } from '../lib/validators';
import {  } from '';
import {
  createdAtColumnOpts,
  updatedAtColumnOpts,
} from '../lib/helpers/modelUtils';

@Entity()
@ObjectType()
// Include manually defined indices from migrations to prevent TypeORM synchronize overwrite
@Index('account_ascending_created_at', { synchronize: false })
@Index('account_descending_created_at', { synchronize: false })
export default class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @CreateDateColumn(createdAtColumnOpts)
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn(updatedAtColumnOpts)
  @Field(() => Date)
  updatedAt: Date;

  @Column({ default: false, nullable: false })
  deleted: boolean;

  @Column('text', { unique: true })
  @Field(() => String)
  email: string;

  @Column('text', { unique: true })
  @Field(() => String)
  username: string;

  @Column()
  password: string;

  @Column()
  @Field(() => ROLES_ENUM)
  @IsIn(ALL_ROLES, { always: true, message: `Invalid role, must be one of: [${ALL_ROLES}]` })
  role: ROLES_ENUM;

  // Virtual fields
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @MaxLength(32, { message: 'Password must be under 32 characters.' })
  plainPassword: string;
}
