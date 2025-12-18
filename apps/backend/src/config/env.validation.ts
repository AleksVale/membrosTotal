import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database
  DATABASE_URL: Joi.string().required().messages({
    'string.empty': 'DATABASE_URL is required',
    'any.required': 'DATABASE_URL is required',
  }),

  // Frontend
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173').messages({
    'string.uri': 'FRONTEND_URL must be a valid URI',
  }),

  // Better Auth (optional)
  BETTER_AUTH_SECRET: Joi.string().optional(),
  BETTER_AUTH_URL: Joi.string().uri().optional(),
});
