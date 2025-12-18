export type UserRole = 'admin' | 'collaborator';

export class Role {
  private readonly value: UserRole;

  constructor(role: UserRole | string) {
    if (!Role.isValid(role)) {
      throw new Error(
        `Invalid role: ${role}. Must be 'admin' or 'collaborator'`,
      );
    }
    this.value = role as UserRole;
  }

  static isValid(role: string | UserRole): role is UserRole {
    return role === 'admin' || role === 'collaborator';
  }

  getValue(): UserRole {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }

  isAdmin(): boolean {
    return this.value === 'admin';
  }

  isCollaborator(): boolean {
    return this.value === 'collaborator';
  }

  toString(): string {
    return this.value;
  }
}
