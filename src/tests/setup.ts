import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('*/hustles', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          title: 'Test Hustle',
          description: 'Test Description',
          status: 'saved',
          tags: ['test'],
          time_commitment: 'low',
          earning_potential: 'medium',
          tools: ['react'],
          image: 'test.jpg',
        },
      ],
    });
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());