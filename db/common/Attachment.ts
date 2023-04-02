import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IAttachment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  friendlyName: string;
  filename: string;
};

export class Attachment implements IAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  friendlyName: string;

  @Column()
  filename: string;

  toJSON(): IAttachment {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      friendlyName: this.friendlyName,
      filename: this.filename
    };
  }
}
