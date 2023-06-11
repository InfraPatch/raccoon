import { MigrationInterface, QueryRunner } from 'typeorm';

export class FilledContractOptionCascadeOnDelete1619015860720
  implements MigrationInterface
{
  name = 'FilledContractOptionCascadeOnDelete1619015860720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` DROP FOREIGN KEY `FK_f40d8d6399028cb839890f56ccb`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` ADD CONSTRAINT `FK_f40d8d6399028cb839890f56ccb` FOREIGN KEY (`filledContractId`) REFERENCES `filledContracts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` DROP FOREIGN KEY `FK_f40d8d6399028cb839890f56ccb`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` ADD CONSTRAINT `FK_f40d8d6399028cb839890f56ccb` FOREIGN KEY (`filledContractId`) REFERENCES `filledContracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
