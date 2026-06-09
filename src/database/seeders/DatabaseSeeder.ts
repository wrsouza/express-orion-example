import { Seeder } from '@wrsouza/orion';
import CategorySeeder from './CategorySeeder';
import UserSeeder from './UserSeeder';

export default class DatabaseSeeder extends Seeder {
  async run(): Promise<void> {
    await this.call([UserSeeder, CategorySeeder]);
  }
}
