import { Blueprint, Migration } from '@wrsouza/orion';

export default class CreateCategoryPostTable extends Migration {
  async up(): Promise<void> {
    await this.Schema.create('category_post', (table: Blueprint) => {
      table.foreignUuid('category_id').references('id').on('categories').onDelete('CASCADE');
      table.foreignUuid('post_id').references('id').on('posts').onDelete('CASCADE');
    });
  }

  async down(): Promise<void> {
    await this.Schema.dropIfExists('category_post');
  }
}
