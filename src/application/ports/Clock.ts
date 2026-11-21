/** Time source. Injected so rules depending on "today" are testable. */
export interface Clock {
  now(): Date;
}
