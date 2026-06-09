import { Blueprint, Migration } from '@wrsouza/orion';

export default class CreateUsersTable extends Migration {
  async up(): Promise<void> {
    await this.Schema.create('users', (table: Blueprint) => {
      table.uuid('id').primary();
      table.string('name', 100).index();
      table.string('email').unique().index();
      table.string('password').nullable();
      table.timestamps();
    });
  }

  async down(): Promise<void> {
    await this.Schema.dropIfExists('users');
  }
}
