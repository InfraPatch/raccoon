import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdentificationFieldsToUsersTable1618843031141
  implements MigrationInterface
{
  name = 'AddIdentificationFieldsToUsersTable1618843031141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `motherName` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `motherBirthDate` timestamp(6) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `nationality` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `users` ADD `personalIdentifierType` enum ('0', '1', '2') NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `personalIdentifier` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `phoneNumber` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `birthDate` timestamp(6) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `birthDate`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `phoneNumber`');
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `personalIdentifier`',
    );
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `personalIdentifierType`',
    );
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `nationality`');
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `motherBirthDate`',
    );
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `motherName`');
  }
}
