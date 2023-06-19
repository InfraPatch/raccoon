import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatMessageModel1687092903200 implements MigrationInterface {
  name = 'CreateChatMessageModel1687092903200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chatMessages\` (\`uuid\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`message\` varchar(255) NOT NULL, \`userId\` int NULL, \`filledContractId\` int NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chatMessages\``);
  }
}
