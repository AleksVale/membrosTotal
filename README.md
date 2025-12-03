# Membros Total

A full-stack monorepo application built with Turborepo, NestJS, React, and Clerk authentication.

## Project Structure

```
membrosTotal/
├── apps/
│   ├── backend/          # NestJS backend application
│   └── frontend/         # React + Vite frontend application
├── packages/              # Shared packages (optional)
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8.15.0

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

#### Backend (`apps/backend/.env`)

Create a `.env` file in `apps/backend/`:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

#### Frontend (`apps/frontend/.env`)

Create a `.env` file in `apps/frontend/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_URL=http://localhost:3000
```

### 3. Set Up Clerk Authentication

1. Sign up for a free account at [Clerk](https://clerk.com/)
2. Create a new application
3. Copy your Publishable Key and Secret Key
4. Add them to the respective `.env` files

### 4. Run Development Servers

```bash
pnpm dev
```

This will start both the backend (http://localhost:3000) and frontend (http://localhost:5173) concurrently.

## Available Scripts

### Root Level

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier

### Backend (`apps/backend`)

- `pnpm dev` - Start NestJS in watch mode
- `pnpm build` - Build the NestJS application
- `pnpm start` - Start the production server
- `pnpm lint` - Lint the codebase
- `pnpm test` - Run tests

### Frontend (`apps/frontend`)

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint the codebase

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Backend**: NestJS with ConfigModule
- **Frontend**: React + Vite
- **Authentication**: Clerk
- **Language**: TypeScript

## Development

The project uses Turborepo for managing the monorepo. Turborepo provides:

- Fast builds with intelligent caching
- Task orchestration and dependencies
- Parallel execution of tasks

## License

MIT

