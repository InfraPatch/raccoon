import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcceptedDefaultValueToFilledContracts1619093408068
  implements MigrationInterface
{
  name = 'AddAcceptedDefaultValueToFilledContracts1619093408068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContracts` CHANGE `accepted` `accepted` tinyint NOT NULL DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContracts` CHANGE `accepted` `accepted` tinyint NOT NULL',
    );
  }
}
