import { HasMany, hidden, map, Model, table, uuid } from '@wrsouza/orion';
import { Post } from './Post';

@table('users')
export class User extends Model {
  @uuid()
  declare id: string;

  declare name: string;
  declare email: string;

  @hidden()
  declare password: string;

  @map('created_at')
  declare createdAt: Date;

  @map('updated_at')
  declare updatedAt: Date;

  posts(): HasMany<Post> {
    return this.hasMany(Post, 'user_id');
  }
}
