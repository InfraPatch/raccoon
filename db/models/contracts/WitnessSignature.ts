import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FilledContract, IFilledContract } from './FilledContract';

import omit from 'lodash.omit';

export interface IWitnessSignature {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  filledContract?: IFilledContract;
  witnessId: number;
  witnessName: string;
  witnessBirthPlace: string;
  witnessBirthDate: Date;
  witnessMotherName: string;
  isSeller: boolean;
  isLawyer: boolean;
  signedAt?: Date;
};

@Entity()
export class WitnessSignature implements IWitnessSignature {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => FilledContract, filledContract => filledContract.options, {
    onDelete: 'CASCADE'
  })
  filledContract: Partial<FilledContract>;

  @Column('integer')
  witnessId: number;

  @Column()
  witnessName: string;

  @Column()
  witnessBirthPlace: string;

  @Column('timestamp')
  witnessBirthDate: Date;

  @Column()
  witnessMotherName: string;

  @Column('boolean')
  isSeller: boolean;

  @Column('boolean')
  isLawyer: boolean;

  @Column('timestamp', { nullable: true })
  signedAt: Date;

  toJSON(): IWitnessSignature {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      filledContract: this.filledContract ? omit(this.filledContract.toJSON(), 'options') : undefined,
      witnessId: this.witnessId,
      witnessName: this.witnessName,
      witnessBirthPlace: this.witnessBirthPlace,
      witnessBirthDate: this.witnessBirthDate,
      witnessMotherName: this.witnessMotherName,
      isSeller: this.isSeller,
      isLawyer: this.isLawyer,
      signedAt: this.signedAt
    };
  }
}

export const isWitnessOf = (userId: number, contract: IFilledContract) : boolean => {
  for (const signature of contract.witnessSignatures) {
    if (signature.witnessId === userId) {
      return true;
    }
  }

  return false;
};

export const hasWitnessSigned = (userId: number, contract: IFilledContract) : boolean => {
  for (const signature of contract.witnessSignatures) {
    if (signature.witnessId === userId) {
      return !!signature.signedAt;
    }
  }

  return false;
};
