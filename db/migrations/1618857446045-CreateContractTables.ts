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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `contracts`');
    await queryRunner.query('DROP TABLE `contractOptions`');
    await queryRunner.query('DROP TABLE `contractFiles`');
  }
}
