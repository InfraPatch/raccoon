import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUseDatetimeInsteadOfTimestamp1618942230066
  implements MigrationInterface
{
  name = 'UserUseDatetimeInsteadOfTimestamp1618942230066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `motherBirthDate`',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `motherBirthDate` datetime NULL',
    );
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `birthDate`');
    await queryRunner.query(
      'ALTER TABLE `users` ADD `birthDate` datetime NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `birthDate`');
    await queryRunner.query(
      'ALTER TABLE `users` ADD `birthDate` timestamp(6) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `motherBirthDate`',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `motherBirthDate` timestamp(6) NULL',
    );
  }
}
