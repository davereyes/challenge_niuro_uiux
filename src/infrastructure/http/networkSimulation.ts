import { err, ok, type Result } from '@shared/types/result';
import { networkError, type ServiceError } from '@application/ports/ServiceError';

/**
 * Mock backend behavior while there is no real API.
 * QA switches (URL query): `?mock=slow` → 12 s responses (2H "Still working…"),
 * `?mock=offline` → every request fails (2I "Try again"). The real device offline state is honored too.
 */
export type NetworkMode = 'normal' | 'slow' | 'offline';

const DEFAULT_LATENCY_MS = Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 600);
const SLOW_LATENCY_MS = 12_000;

export const currentNetworkMode = (): NetworkMode => {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  const mode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('mock') : null;
  return mode === 'slow' || mode === 'offline' ? mode : 'normal';
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const simulateRequest = async <T>(
  produce: () => T,
  latencyMs: number = DEFAULT_LATENCY_MS,
): Promise<Result<T, ServiceError>> => {
  const mode = currentNetworkMode();
  await wait(mode === 'slow' ? SLOW_LATENCY_MS : latencyMs);
  if (mode === 'offline') return err(networkError);
  return ok(produce());
};
