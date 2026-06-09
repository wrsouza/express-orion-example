import { Blueprint, Migration } from '@wrsouza/orion';

export default class CreatePostsTable extends Migration {
  async up(): Promise<void> {
    await this.Schema.create('posts', (table: Blueprint) => {
      table.uuid('id').primary();
      table.foreignUuid('user_id').references('id').on('users').onDelete('CASCADE');
      table.string('title');
      table.text('body').nullable();
      table.boolean('published').default(false);
      table.timestamp('published_at').nullable();
      table.timestamps();
    });
  }

  async down(): Promise<void> {
    await this.Schema.dropIfExists('posts');
  }
}
