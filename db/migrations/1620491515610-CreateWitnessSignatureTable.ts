import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWitnessSignatureTable1620491515610
  implements MigrationInterface
{
  name = 'CreateWitnessSignatureTable1620491515610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `witnessSignatures` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `witnessId` int NOT NULL, `witnessName` varchar(255) NOT NULL, `witnessBirthPlace` varchar(255) NOT NULL, `witnessBirthDate` timestamp NOT NULL, `witnessMotherName` varchar(255) NOT NULL, `isLawyer` tinyint NOT NULL, `signedAt` timestamp NULL, `filledContractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `witnessSignatures`');
  }
}
