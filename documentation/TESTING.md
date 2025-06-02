# Testing Documentation

## Running Tests

To run all tests:
```bash
npm run test
```

To run tests in watch mode:
```bash
npm run test -- --watch
```

## Test Coverage

To generate test coverage report:
```bash
npm run test -- --coverage
```

## Test Structure

### Unit Tests

#### API Tests
- Authentication
  - Login
  - Signup
  - Password Reset
  - OAuth
  - Rate Limiting
  - Request Validation

- CRUD Operations
  - Hustles
  - User Profiles
  - Notes

#### Component Tests
- Form Validation
- Error Handling
- UI States

### Integration Tests

#### API Integration
- Supabase Client
- Real-time Subscriptions
- File Upload
- Rate Limiting
- Request Validation

#### Feature Tests
- Search Functionality
- Pagination
- Filtering

## Example Tests

### Rate Limiting Tests
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('Rate Limiting', () => {
  it('should limit API requests', async () => {
    // Make multiple requests
    for (let i = 0; i < 101; i++) {
      const response = await request(app).get('/api/hustles');
      
      if (i < 100) {
        expect(response.status).not.toBe(429);
      } else {
        expect(response.status).toBe(429);
        expect(response.body.message).toContain('Too many requests');
      }
    }
  });

  it('should limit auth requests more strictly', async () => {
    // Make multiple auth requests
    for (let i = 0; i < 6; i++) {
      const response = await request(app).post('/api/auth/login');
      
      if (i < 5) {
        expect(response.status).not.toBe(429);
      } else {
        expect(response.status).toBe(429);
        expect(response.body.message).toContain('Too many authentication attempts');
      }
    }
  });
});
```

### Request Validation Tests
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('Request Validation', () => {
  it('should validate login request', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: '123' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual({
      field: 'email',
      message: 'Invalid email address',
    });
  });

  it('should validate hustle creation', async () => {
    const response = await request(app)
      .post('/api/hustles')
      .send({
        title: '',
        description: '',
        status: 'invalid',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });
});
```

## Test Coverage Requirements

- Minimum 80% overall coverage
- 100% coverage for critical paths:
  - Authentication
  - Data mutations
  - Form validation
  - Rate limiting
  - Request validation

## Running Tests in CI/CD

Tests are automatically run in the CI/CD pipeline:
- On pull requests
- Before deployment
- Nightly for regression testing

## Mocking

### API Mocks
```typescript
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));
```

### Auth Mocks
```typescript
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
    isAuthenticated: true,
  }),
}));
```

## Error Handling Tests

```typescript
describe('Error Handling', () => {
  it('should show error toast on API failure', async () => {
    const error = new Error('API Error');
    vi.spyOn(supabase, 'from').mockImplementation(() => {
      throw error;
    });

    render(<YourComponent />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
});
```