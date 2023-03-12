import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Contract, IContract } from './Contract';
import { FilledContractOption, IFilledContractOption } from './FilledContractOption';

import omit from 'lodash.omit';

export interface IFilledContract {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  contract?: IContract;
  options?: IFilledContractOption[];
  filledAt?: Date;
};

@Entity()
export class FilledContract implements IFilledContract {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contract)
  contract: Partial<Contract>;

  @OneToMany(() => FilledContractOption, filledContractOption => filledContractOption.filledContract)
  options: Partial<FilledContractOption[]>;

  // thanks to next-auth's incompatibility with typeorm entities, I cannot
  // establish a many-to-one relationship here, so it's just the user ID.
  // please guys can you do anything right.
  @Column('integer')
  userId: number;

  @Column('timestamp', { nullable: true })
  filledAt?: Date;

  toJSON(): IFilledContract {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      contract: this.contract,
      options: this.options.map(option => omit(option.toJSON(), 'filledContract')),
      userId: this.userId,
      filledAt: this.filledAt
    };
  }
}
