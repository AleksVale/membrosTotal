import { Role } from '../value-objects/role.vo';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: Role,
    public readonly emailVerified: boolean,
    public readonly image: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  isCollaborator(): boolean {
    return this.role.isCollaborator();
  }

  hasVerifiedEmail(): boolean {
    return this.emailVerified;
  }

  update(updates: Partial<Pick<User, 'name' | 'image'>>): User {
    return new User(
      this.id,
      this.email,
      updates.name ?? this.name,
      this.role,
      this.emailVerified,
      updates.image ?? this.image,
      this.createdAt,
      new Date(), // updatedAt always changes
    );
  }
}
