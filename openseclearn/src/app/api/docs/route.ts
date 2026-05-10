import { NextResponse } from 'next/server';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'OpenSecLearn API',
    version: '1.0.0',
    description: 'REST API for the OpenSecLearn cybersecurity learning platform.',
  },
  servers: [{ url: '/api', description: 'Local dev server' }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /auth/login or /auth/signup',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      Progress: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          completed_lessons: { type: 'array', items: { type: 'string' } },
          completed_homework: { type: 'array', items: { type: 'string' } },
          current_stage: { type: 'string' },
          completion_percentage: { type: 'number' },
          last_activity: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Submission: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          homework_id: { type: 'string' },
          answer_text: { type: 'string' },
          status: { type: 'string', enum: ['submitted', 'reviewed', 'passed'] },
          submitted_at: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '409': { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login with email and password',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '429': { description: 'Too many login attempts', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/users': {
      get: {
        summary: 'List all users (Admin)',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { users: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden (not admin)' },
        },
      },
    },
    '/users/{id}': {
      delete: {
        summary: 'Delete a user (Admin)',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'User deleted' },
          '400': { description: 'Cannot delete own account' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden (not admin)' },
          '404': { description: 'User not found' },
        },
      },
    },
    '/progress/me': {
      get: {
        summary: 'Get own progress',
        tags: ['Progress'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: "Current user's progress",
            content: { 'application/json': { schema: { type: 'object', properties: { progress: { $ref: '#/components/schemas/Progress' } } } } },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/progress/{userId}': {
      get: {
        summary: "Get a user's progress (Admin)",
        tags: ['Progress'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: "User's progress",
            content: { 'application/json': { schema: { type: 'object', properties: { progress: { $ref: '#/components/schemas/Progress' } } } } },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden (not admin)' },
          '404': { description: 'User not found' },
        },
      },
    },
    '/homework': {
      get: {
        summary: 'List all homework',
        tags: ['Homework'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Homework list',
            content: { 'application/json': { schema: { type: 'object', properties: { homework: { type: 'array', items: { type: 'object' } } } } } },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/homework/{id}/submit': {
      post: {
        summary: 'Submit homework answer',
        tags: ['Homework'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['answerText'],
                properties: { answerText: { type: 'string', minLength: 1 } },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Submission saved',
            content: { 'application/json': { schema: { type: 'object', properties: { submission: { $ref: '#/components/schemas/Submission' } } } } },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec, {
    headers: { 'Content-Type': 'application/json' },
  });
}
