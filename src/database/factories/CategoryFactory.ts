import { faker } from '@faker-js/faker';
import { Factory } from '@wrsouza/orion';
import { Category } from '../models/Category';

export class CategoryFactory extends Factory<Category> {
  model = Category;

  definition(): Record<string, unknown> {
    const name = `${faker.commerce.department()} ${faker.string.alphanumeric(6)}`;
    const slug = faker.helpers.slugify(name).toLowerCase();
    const description = faker.commerce.productDescription();
    const isActive = faker.datatype.boolean();

    return {
      name,
      slug,
      description,
      isActive,
    };
  }
}
