/** Failure of an external call. `network` covers offline/timeouts (canvas 2I: "Try again"). */
export interface ServiceError {
  readonly kind: 'network' | 'unknown';
}

export const networkError: ServiceError = { kind: 'network' };
