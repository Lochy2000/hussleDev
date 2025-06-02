import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHustles } from '../../hooks/useHustles';

describe('useHustles', () => {
  it('should fetch hustles successfully', async () => {
    const { result } = renderHook(() => useHustles());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.getUserHustles('test-user');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle errors gracefully', async () => {
    server.use(
      http.get('*/hustles', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useHustles());

    await act(async () => {
      try {
        await result.current.getUserHustles('test-user');
      } catch (error) {
        expect(result.current.error).toBeTruthy();
        expect(result.current.loading).toBe(false);
      }
    });
  });
});