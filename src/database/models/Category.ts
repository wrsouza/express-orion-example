import { BelongsToMany, map, Model, table, uuid } from '@wrsouza/orion';
import { Post } from './Post';

@table('categories')
export class Category extends Model {
  @uuid()
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string;
  
  @map('is_active')
  declare isActive: boolean;

  @map('created_at')
  declare createdAt: Date;
  
  @map('updated_at')
  declare updatedAt: Date;

  posts(): BelongsToMany<Post> {
    return this.belongsToMany(Post, 'category_post', 'category_id', 'post_id').withoutPivot();
  }
}