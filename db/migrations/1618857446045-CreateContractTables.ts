import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContractTables1618857446045 implements MigrationInterface {
  name = 'CreateContractTables1618857446045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `contractFiles` (`id` int NOT NULL AUTO_INCREMENT, `friendlyName` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `contractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `contractOptions` (`id` int NOT NULL AUTO_INCREMENT, `type` enum ('0', '1', '2', '3', '4', '5', '6', '7', '8') NOT NULL DEFAULT '0', `priority` int NOT NULL, `friendlyName` varchar(255) NOT NULL, `longDescription` varchar(255) NULL, `hint` varchar(255) NULL, `replacementString` varchar(255) NOT NULL, `minimumValue` int NULL, `maximumValue` int NULL, `contractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `contracts` (`id` int NOT NULL AUTO_INCREMENT, `friendlyName` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `contractFiles` ADD CONSTRAINT `FK_4ad73d5e9c4b70e88189f6c5ee6` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `contractOptions` ADD CONSTRAINT `FK_208bf304dda78757fb1f5de2f47` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `contractOptions` DROP FOREIGN KEY `FK_208bf304dda78757fb1f5de2f47`',
    );
    await queryRunner.query(
      'ALTER TABLE `contractFiles` DROP FOREIGN KEY `FK_4ad73d5e9c4b70e88189f6c5ee6`',
    );
    await queryRunner.query('DROP TABLE `contracts`');
    await queryRunner.query('DROP TABLE `contractOptions`');
    await queryRunner.query('DROP TABLE `contractFiles`');
  }
}
