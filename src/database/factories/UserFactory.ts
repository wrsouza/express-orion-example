import { faker } from '@faker-js/faker';
import { Factory } from '@wrsouza/orion';
import { BcryptService } from '../../services/bcrypt.service';
import { User } from '../models/User';

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Record<string, unknown> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    const password = BcryptService.hashPassword('password123');

    return {
      name,
      email,
      password,
    };
  }
}
