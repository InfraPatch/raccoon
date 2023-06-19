import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedNextAuthTables1687209753936
  implements MigrationInterface
{
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `accounts` (`id` int NOT NULL AUTO_INCREMENT, `compoundId` varchar(255) NOT NULL, `userId` int NOT NULL, `providerType` varchar(255) NOT NULL, `providerId` varchar(255) NOT NULL, `providerAccountId` varchar(255) NOT NULL, `refreshToken` text NULL, `accessToken` text NULL, `accessTokenExpires` timestamp(6) NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX `userId` (`userId`), INDEX `providerId` (`providerId`), INDEX `providerAccountId` (`providerAccountId`), UNIQUE INDEX `IDX_2e2fe9a03f5f74035bd4b08e73` (`compoundId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `sessions` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `expires` timestamp(6) NOT NULL, `sessionToken` varchar(255) NOT NULL, `accessToken` varchar(255) NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_8b5e2ec52e335c0fe16d7ec358` (`sessionToken`), UNIQUE INDEX `IDX_c6d6176d411b0b3c854df5d4d0` (`accessToken`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `verificationRequests` (`id` int NOT NULL AUTO_INCREMENT, `identifier` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `expires` timestamp(6) NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_4283e0003ada39ad908fd889fc` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_4283e0003ada39ad908fd889fc` ON `verificationRequests`',
    );
    await queryRunner.query('DROP TABLE `verificationRequests`');
    await queryRunner.query(
      'DROP INDEX `IDX_c6d6176d411b0b3c854df5d4d0` ON `sessions`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8b5e2ec52e335c0fe16d7ec358` ON `sessions`',
    );
    await queryRunner.query('DROP TABLE `sessions`');
    await queryRunner.query(
      'DROP INDEX `IDX_2e2fe9a03f5f74035bd4b08e73` ON `accounts`',
    );
    await queryRunner.query('DROP INDEX `providerAccountId` ON `accounts`');
    await queryRunner.query('DROP INDEX `providerId` ON `accounts`');
    await queryRunner.query('DROP INDEX `userId` ON `accounts`');
    await queryRunner.query('DROP TABLE `accounts`');
  }
}
