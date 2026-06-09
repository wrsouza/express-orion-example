import { faker } from '@faker-js/faker';
import { Factory } from '@wrsouza/orion';
import { Post } from '../models/Post';

export class PostFactory extends Factory<Post> {
  model = Post;

  definition(): Record<string, unknown> {
    const title = faker.lorem.sentence();
    const body = faker.lorem.paragraphs(3);
    const published = faker.datatype.boolean();
    const publishedAt = published ? faker.date.recent() : null;
    
    return {
      title,
      body,
      published,
      publishedAt,
    };
  }
}
