import { Seeder } from '@wrsouza/orion';
import { CategoryFactory } from '../factories/CategoryFactory';
import { Category } from '../models/Category';
import { Post } from '../models/Post';

export default class CategorySeeder extends Seeder {
  async run(): Promise<void> {
    // busca todos os posts já criados
    const posts = await Post.all();

    const categories = await new CategoryFactory().count(5).create();

    for (const category of categories as unknown as Category[]) {
      // embaralha e pega 5 posts aleatórios para cada categoria
      const shuffled = posts.toArray().sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 5);
      const postIds = selected.map((p) => p.id);

      await category.posts().attach(postIds);
    }
  }
}
