import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterStatementTableAddSenderId1621384997458
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({ name: 'sender_id', type: 'uuid', isNullable: true }),
    );

    await queryRunner.createForeignKey(
      'statements',
      new TableForeignKey({
        name: 'transference_sender',
        columnNames: ['sender_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('statements', 'transference_sender');

    await queryRunner.dropColumn('statements', 'sender_id');
  }
}
