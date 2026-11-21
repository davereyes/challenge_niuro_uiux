import type { PersistableDraft } from '../entities/ApplicationDraft';

/**
 * Port: device-side cache of the application so the user can resume (business rule, 30 days).
 * Implementations must never receive identity data (see `toPersistable`).
 */
export interface ApplicationDraftRepository {
  load(): Promise<PersistableDraft | null>;
  save(draft: PersistableDraft): Promise<void>;
  clear(): Promise<void>;
}
