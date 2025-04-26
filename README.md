# Membros Total

This repository contains both backend and frontend code for the Membros Total application.

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- npm or yarn

### Running with Docker

To run the entire application stack using Docker:

```bash
docker-compose up -d
```

This will start:
- Frontend: accessible at http://localhost
- Backend API: accessible at http://localhost:3000
- PostgreSQL database: accessible at localhost:5432

To stop all services:

```bash
docker-compose down
```

### Running without Docker

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment.

### PR Checks

Whenever a pull request is created against the `main` or `develop` branches, the following checks are automatically run:

- Backend:
  - Linting
  - Unit tests (without database integration)
  - Build check

- Frontend:
  - Linting
  - Build check

### Deployment

When changes are pushed to the `main` branch, the application is automatically deployed:

1. Environment files are created from GitHub secrets
2. The entire project (including Dockerfiles) is packaged
3. The package is transferred to the production server via SCP
4. Docker images are built locally on the server
5. Services are started using Docker Compose

## Environment Variables

For local development, create `.env` files in both backend and frontend directories with the required variables.

### Backend Environment Variables

```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/membros
PORT=3000
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
BUCKET=your_s3_bucket
JWT_EXPIRATION_TIME=8h
JWT_PRIVATE_KEY=your_jwt_private_key
JWT_PUBLIC_KEY=your_jwt_public_key
MAILER_USERNAME=your_email_username
MAILER_PASSWORD=your_email_password
```

## Project Structure

- `/backend` - NestJS API
- `/frontend` - React/Vite frontend
- `/docker-compose.yml` - Docker Compose configuration
- `/.github/workflows` - CI/CD workflow definitions
