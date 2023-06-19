import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OptionType } from './OptionType';

export interface IOption {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  type?: OptionType;
  priority?: number;
  friendlyName?: string;
  longDescription?: string;
  hint?: string;
  replacementString?: string;
  minimumValue?: number;
  maximumValue?: number;
}

export class Option implements IOption {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column('enum', { enum: OptionType, default: OptionType.STRING })
  type: OptionType;

  @Column('integer')
  priority: number;

  @Column()
  friendlyName: string;

  @Column({ nullable: true })
  longDescription?: string;

  @Column({ nullable: true })
  hint?: string;

  @Column()
  replacementString: string;

  @Column('integer', { nullable: true })
  minimumValue?: number;

  @Column('integer', { nullable: true })
  maximumValue?: number;

  toJSON(): IOption {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.type,
      priority: this.priority,
      friendlyName: this.friendlyName,
      longDescription: this.longDescription,
      hint: this.hint,
      replacementString: this.replacementString,
      minimumValue: this.minimumValue,
      maximumValue: this.maximumValue,
    };
  }
}
