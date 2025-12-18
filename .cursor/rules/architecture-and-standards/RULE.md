---
description: 'Clean Architecture, SOLID principles, and coding standards for Membros Total backend'
alwaysApply: true
---

# Membros Total - Architecture & Coding Standards

## Project Overview

This is a **monorepo** using:

- **Turborepo** for monorepo management
- **NestJS** backend with Clean Architecture
- **Next.js** frontend (apps/web)
- **Better Auth** for authentication (NOT Clerk - README is outdated)
- **Prisma** for database access with PostgreSQL
- **pnpm** for package management

## Critical Rules

### 1. No Comments Policy

**NEVER add comments to code.** Code must be self-documenting through:

- Descriptive function names: `calculateUserEnrollmentProgress()` not `calc()` with a comment
- Descriptive variable names: `userEnrollmentDate` not `date` with a comment
- Clear intent through code structure
- If code needs explanation, refactor it to be clearer

### 2. Repository Pattern (MANDATORY)

- Use cases MUST use repository interfaces, never Prisma directly
- All database access goes through repositories
- Repository interfaces are in `domain/`, implementations in `infrastructure/`
- Transactions belong in repositories, not use cases
- Never access `this.prisma` directly from use cases

### 3. UUID Generation (MANDATORY)

- **NEVER generate UUIDs manually** (no `randomUUID()`, no `crypto.randomUUID()`)
- Prisma generates UUIDs via `@default(uuid())` in schema
- Repository methods accept data objects without IDs
- Let Prisma handle ID generation automatically on create

### 4. Type Safety (MANDATORY)

- **NEVER use `any` types**
- Use `Prisma.*GetPayload<>` for Prisma result types
- Access Prisma directly: `this.prisma.modelName`, not `(this.prisma as any)`
- Create proper interfaces for complex data structures
- Leverage TypeScript's type system fully

### 5. Better Auth Compatibility (CRITICAL)

- User model modifications must be minimal and safe
- Only add relationships to User model, never modify existing fields
- Don't add `@default(uuid())` to User.id - Better Auth manages it
- Test authentication still works after schema changes
- Better Auth only reads/writes User table fields directly

### 6. Internal Tool - No Pricing

- Everything is free - no pricing logic should exist
- No payment-related code
- All trainings and lessons are free
- Remove any pricing/payment references

## Clean Architecture Structure

```
src/
├── domain/           # Business logic, entities, interfaces
│   ├── entities/     # Domain entities with business logic
│   ├── repositories/ # Repository interfaces (abstract)
│   └── value-objects/ # Value objects
├── application/      # Use cases and application DTOs
│   ├── use-cases/    # Business operations
│   └── dto/          # Application data transfer objects
├── infrastructure/   # External implementations
│   └── repositories/ # Prisma repository implementations
└── presentation/     # HTTP layer
    ├── controllers/  # REST endpoints
    └── dto/          # Request/response DTOs with validation
```

### Dependency Rule

- Dependencies flow inward: Presentation → Application → Domain
- Domain layer has NO dependencies (pure business logic)
- Infrastructure implements domain interfaces
- Use cases depend on interfaces, not implementations

## SOLID Principles

### Single Responsibility Principle

- Each class/function should have one reason to change
- Separate concerns into different classes/modules
- Functions should do one thing and do it well

### Open/Closed Principle

- Open for extension, closed for modification
- Use interfaces and abstractions
- Prefer composition over modification

### Liskov Substitution Principle

- Implementations should be substitutable for their interfaces
- Repository implementations must fully satisfy interface contracts
- No breaking changes to interface contracts

### Interface Segregation Principle

- Create focused, specific interfaces
- Don't force classes to implement methods they don't need
- Split large interfaces into smaller, focused ones

### Dependency Inversion Principle

- Depend on abstractions (interfaces), not concretions
- High-level modules should not depend on low-level modules
- Both should depend on abstractions

## Code Style Guidelines

### Naming Conventions

- Use descriptive, intention-revealing names
- Functions should clearly express what they do
- Variables should clearly express what they represent
- Avoid abbreviations unless widely understood
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces

### Function Design

- Functions should do one thing and do it well
- Prefer small, focused functions over large ones
- Functions should be pure when possible (no side effects)
- Use meaningful return types
- Keep functions under 50 lines when possible

### Type Safety

- Always use proper TypeScript types
- Avoid `any` types - use Prisma types or create proper interfaces
- Use Prisma's `GetPayload` types for proper typing
- Leverage TypeScript's type system fully
- Use type guards when needed

## Database & Prisma

### Transactions

- Use Prisma transactions for multi-step operations
- Transaction logic belongs in repositories, not use cases
- Use `$transaction` for atomic operations
- Handle transaction errors properly

### Type Safety with Prisma

- Use `Prisma.*GetPayload<>` types instead of `any`
- Access Prisma client directly: `this.prisma.modelName`
- Create proper type definitions for complex queries
- Map Prisma models to domain entities in repositories

### Schema Changes

- Always generate migrations after schema changes
- Test migrations on development database first
- Be careful with Better Auth models (User, Session, Account, Verification)

## Module Structure

### File Naming

- Entities: `training.entity.ts`, `user.entity.ts`
- Repositories: `training.repository.interface.ts`, `training.repository.ts`
- Use Cases: `create-training.use-case.ts`, `get-user.use-case.ts`
- DTOs: `create-training.dto.ts`, `training-response.dto.ts`
- Controllers: `training.controller.ts`
- Modules: `training.module.ts`

### Module Registration

Always register new modules in the appropriate parent module:

- Infrastructure modules → Application modules
- Application modules → Presentation modules
- Presentation modules → `app.module.ts`

## When Adding New Features

1. **Domain Layer First**: Create entities and repository interfaces
2. **Infrastructure Layer**: Implement repositories with Prisma
3. **Application Layer**: Create use cases and DTOs
4. **Presentation Layer**: Create controllers and request DTOs
5. **Wire Up**: Register all modules properly

## Error Handling

- Use NestJS exceptions (NotFoundException, ConflictException, etc.)
- Throw exceptions from use cases
- Let NestJS exception filters handle HTTP responses
- Provide meaningful error messages
- Use appropriate HTTP status codes

## API Documentation

- Use Swagger/OpenAPI decorators on controllers
- Document all endpoints with `@ApiOperation`, `@ApiResponse`
- Use `@ApiBearerAuth` for authenticated endpoints
- Document request/response DTOs with `@ApiProperty`

## Validation

- Validate input at presentation layer
- Use class-validator decorators
- Return meaningful error messages
- Validate business rules in use cases

## Turborepo Guidelines

### Workspace Structure

- `apps/backend/` - NestJS backend application
- `apps/web/` - Next.js frontend application
- `packages/shared/` - Shared code between apps

### Commands

- Use pnpm for package management
- Run commands from root: `pnpm dev`, `pnpm build`
- Each app has its own `package.json`
- Shared code goes in `packages/shared/`

## Code Examples

### ✅ Good: Repository Pattern, No Comments, Proper Types

```typescript
async findUserEnrollmentsForTraining(
  userId: string,
  trainingId: string,
): Promise<Enrollment[]> {
  return this.enrollmentRepository.findByUserAndTraining(userId, trainingId);
}
```

### ❌ Bad: Comments, Direct Prisma, Any Types

```typescript
// Get user enrollments
async get(userId: string, tid: string): Promise<any> {
  return (this.prisma as any).enrollment.findMany({
    where: { userId, trainingId: tid },
  });
}
```

### ✅ Good: Let Prisma Generate UUIDs

```typescript
async create(data: CreateEnrollmentData): Promise<Enrollment> {
  const prismaEnrollment = await this.prisma.enrollment.create({
    data: {
      userId: data.userId,
      trainingId: data.trainingId,
      enrolledAt: data.enrolledAt,
    },
  });
  return this.toDomainEntity(prismaEnrollment);
}
```

### ❌ Bad: Manual UUID Generation

```typescript
async create(data: CreateEnrollmentData): Promise<Enrollment> {
  const id = randomUUID();
  const prismaEnrollment = await this.prisma.enrollment.create({
    data: { id, userId: data.userId, /* ... */ },
  });
  return this.toDomainEntity(prismaEnrollment);
}
```

### ✅ Good: Proper Types

```typescript
private toDomainEntity(
  prismaTraining: Prisma.TrainingGetPayload<Record<string, never>>,
): Training {
  return new Training(/* ... */);
}
```

### ❌ Bad: Any Types

```typescript
private toDomainEntity(prismaTraining: any): Training {
  return new Training(/* ... */);
}
```

## What NOT to Do

- ❌ Don't add comments to code
- ❌ Don't generate UUIDs manually
- ❌ Don't use `any` types
- ❌ Don't access Prisma directly from use cases
- ❌ Don't modify Better Auth User model fields
- ❌ Don't add pricing/payment logic
- ❌ Don't mix concerns between layers
- ❌ Don't create circular dependencies
- ❌ Don't skip type definitions
- ❌ Don't use magic numbers or strings
- ❌ Don't put business logic in controllers
- ❌ Don't put database logic in use cases

## What TO Do

- ✅ Use descriptive names for functions and variables
- ✅ Let Prisma generate UUIDs
- ✅ Use proper TypeScript types
- ✅ Use repository pattern for data access
- ✅ Follow Clean Architecture layers
- ✅ Write small, focused functions
- ✅ Use SOLID principles
- ✅ Keep domain layer pure
- ✅ Test use cases with mocked repositories
- ✅ Document APIs with Swagger decorators
- ✅ Validate input at presentation layer
- ✅ Handle errors with NestJS exceptions
- ✅ Keep functions pure when possible
