import { Blueprint, Migration } from '@wrsouza/orion';

export default class CreateCategoriesTable extends Migration {
  async up(): Promise<void> {
    await this.Schema.create('categories', (table: Blueprint) => {
      table.uuid().primary();
      table.string('name', 50).index();
      table.string('slug', 100).unique();
      table.string('description', 255).nullable();
      table.boolean('is_active').default(false);
      table.timestamps();
    });
  }

  async down(): Promise<void> {
    await this.Schema.dropIfExists('categories');
  }
}
