/**
 * Hook useApiCall - Pour gérer les appels API avec loading/error
 */

import { useState, useCallback } from 'react';
import { APIError } from '@/lib/api-client';

export interface UseApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: APIError | Error | null;
}

export function useApiCall<T = unknown>() {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiFunction: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook useFetch - Pour faire des requêtes GET simples
 */

import { useEffect } from 'react';

export function useFetch<T = unknown>(
  apiFunction: (() => Promise<T>) | null,
  dependencies?: unknown[]
) {
  const { data, loading, error, execute } = useApiCall<T>();

  useEffect(() => {
    if (!apiFunction) return;

    execute(apiFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies || []);

  return { data, loading, error };
}

/**
 * Hook useAsync - Pour gérer les états async complexes
 */

export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies?: unknown[]
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err as E);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (!immediate) return;
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies || []);

  return { execute, status, data, error };
}
