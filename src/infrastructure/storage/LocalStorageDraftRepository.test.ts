import { describe, expect, it } from 'vitest';

import { createEmptyDraft, toPersistable } from '@domain/entities/ApplicationDraft';

import { LocalStorageDraftRepository } from './LocalStorageDraftRepository';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe('LocalStorageDraftRepository', () => {
  it('round-trips a draft', async () => {
    const repository = new LocalStorageDraftRepository(new MemoryStorage());
    const draft = toPersistable(createEmptyDraft(new Date('2026-11-20T00:00:00Z')));
    await repository.save(draft);
    expect(await repository.load()).toEqual(draft);
    await repository.clear();
    expect(await repository.load()).toBeNull();
  });

  it('never writes identity data', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageDraftRepository(storage);
    const leaky = { ...createEmptyDraft(new Date()), identity: { ssn: '123456789' } };
    await repository.save(leaky as never);
    expect(storage.getItem('fundo.apply.draft')).not.toContain('123456789');
  });

  it('survives corrupted data and missing storage', async () => {
    const storage = new MemoryStorage();
    storage.setItem('fundo.apply.draft', '{not json');
    expect(await new LocalStorageDraftRepository(storage).load()).toBeNull();
    expect(await new LocalStorageDraftRepository(null).load()).toBeNull();
  });
});
