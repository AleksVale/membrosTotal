export interface EnvConfig {
  // Server
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;

  // Database
  DATABASE_URL: string;

  // Frontend
  FRONTEND_URL: string;

  // Better Auth
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
}
