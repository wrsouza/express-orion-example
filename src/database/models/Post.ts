import { BelongsTo, BelongsToMany, map, Model, table, uuid } from '@wrsouza/orion';
import { Category } from './Category';
import { User } from './User';

@table('posts')
export class Post extends Model {
  @uuid()
  declare id: string;
  declare user_id: string;
  declare title: string;
  declare body: string | null;
  declare published: boolean;

  @map('published_at')
  declare publishedAt: Date | null;

  @map('created_at')
  declare createdAt: Date;

  @map('updated_at')
  declare updatedAt: Date;

  user(): BelongsTo<User> {
    return this.belongsTo(User, 'user_id');
  }

  categories(): BelongsToMany<Category> {
    return this.belongsToMany(Category, 'category_post', 'post_id', 'category_id').withoutPivot();
  }
}
