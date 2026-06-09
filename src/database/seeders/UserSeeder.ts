import { Seeder } from '@wrsouza/orion';
import { PostFactory } from '../factories/PostFactory';
import { UserFactory } from '../factories/UserFactory';

export default class UserSeeder extends Seeder {
  async run(): Promise<void> {
    // 5 users, each with 2 posts
    await new UserFactory()
      .count(5)
      .has(new PostFactory().count(2))
      .create();
  }
}
