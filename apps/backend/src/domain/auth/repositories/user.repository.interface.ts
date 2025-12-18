import { User } from '../entities/user.entity';

export abstract class UserRepositoryInterface {
  abstract findById(id: string): Promise<User | null>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract update(
    id: string,
    updates: Partial<Pick<User, 'name' | 'image'>>,
  ): Promise<User>;

  abstract exists(id: string): Promise<boolean>;
}
