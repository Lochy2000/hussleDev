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

#### Feature Tests
- Search Functionality
- Pagination
- Filtering

## Example Tests

### API Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Hustle API', () => {
  it('should fetch hustles with pagination', async () => {
    const { data, error, count } = await supabase
      .from('hustles')
      .select('*', { count: 'exact' })
      .range(0, 9);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(count).toBeDefined();
    expect(data?.length).toBeLessThanOrEqual(10);
  });

  it('should search hustles by title', async () => {
    const searchTerm = 'test';
    const { data, error } = await supabase
      .from('hustles')
      .select('*')
      .ilike('title', `%${searchTerm}%`);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    data?.forEach(hustle => {
      expect(hustle.title.toLowerCase()).toContain(searchTerm);
    });
  });
});
```

### Component Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('should call onSearch when input changes', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search hustles...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('should debounce search input', async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search hustles...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
```

## Test Coverage Requirements

- Minimum 80% overall coverage
- 100% coverage for critical paths:
  - Authentication
  - Data mutations
  - Form validation

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