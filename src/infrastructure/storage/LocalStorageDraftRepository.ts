import type { PersistableDraft } from '@domain/entities/ApplicationDraft';
import type { ApplicationDraftRepository } from '@domain/repositories/ApplicationDraftRepository';

const STORAGE_KEY = 'fundo.apply.draft';
const SCHEMA_VERSION = 1;

interface StoredEnvelope {
  version: number;
  draft: PersistableDraft;
}

/**
 * Device cache of the application (resume, 30 days — expiry rule lives in the domain).
 * Defensive: tolerates unavailable storage (private mode) and strips identity data if it ever arrives.
 */
export class LocalStorageDraftRepository implements ApplicationDraftRepository {
  private readonly storage: Storage | null;

  constructor(storage: Storage | null = LocalStorageDraftRepository.availableStorage()) {
    this.storage = storage;
  }

  private static availableStorage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }

  async load(): Promise<PersistableDraft | null> {
    try {
      const raw = this.storage?.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredEnvelope;
      return parsed.version === SCHEMA_VERSION ? parsed.draft : null;
    } catch {
      return null;
    }
  }

  async save(draft: PersistableDraft): Promise<void> {
    const { identity: _identity, ...safe } = draft as PersistableDraft & { identity?: unknown };
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, draft: safe } satisfies StoredEnvelope));
    } catch {
      // Storage full or blocked: progress just won't survive a reload.
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage?.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
