import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFilenameFieldToFilledContract1619009711753
  implements MigrationInterface
{
  name = 'AddFilenameFieldToFilledContract1619009711753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContracts` ADD `friendlyName` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContracts` ADD `filename` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContracts` DROP COLUMN `filename`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContracts` DROP COLUMN `friendlyName`',
    );
  }
}
