import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiUnauthorizedResponse(description?: string) {
  return ApiResponse({
    status: 401,
    description: description || 'Unauthorized - Authentication required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  });
}

export function ApiForbiddenResponse(description?: string) {
  return ApiResponse({
    status: 403,
    description: description || 'Forbidden - Admin access required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
      },
    },
  });
}

export function ApiNotFoundResponse(
  resourceName: string = 'Resource',
  exampleMessage?: string,
) {
  return ApiResponse({
    status: 404,
    description: `${resourceName} not found`,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: exampleMessage || `${resourceName} with id "xxx" not found`,
        },
      },
    },
  });
}

export function ApiBadRequestResponse(description?: string) {
  return ApiResponse({
    status: 400,
    description: description || 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  });
}

export function ApiConflictResponse(description?: string) {
  return ApiResponse({
    status: 409,
    description: description || 'Conflict - Resource already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Resource already exists' },
      },
    },
  });
}

export function ApiAdminOnlyResponses(options?: {
  notFoundResource?: string;
  notFoundMessage?: string;
  includeBadRequest?: boolean;
  includeConflict?: boolean;
}) {
  const decorators = [
    ApiUnauthorizedResponse(),
    ApiForbiddenResponse(),
  ];

  if (options?.includeBadRequest) {
    decorators.push(ApiBadRequestResponse());
  }

  if (options?.notFoundResource) {
    decorators.push(
      ApiNotFoundResponse(
        options.notFoundResource,
        options.notFoundMessage,
      ),
    );
  }

  if (options?.includeConflict) {
    decorators.push(ApiConflictResponse());
  }

  return applyDecorators(...decorators);
}
