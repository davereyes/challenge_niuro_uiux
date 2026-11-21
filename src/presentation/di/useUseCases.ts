import { use } from 'react';

import type { UseCases } from '@application/use-cases/UseCases';

import { UseCasesContext } from './UseCasesContext';

/** Access use cases from feature hooks. Never instantiate them in components. */
export const useUseCases = (): UseCases => {
  const useCases = use(UseCasesContext);
  if (!useCases) {
    throw new Error('useUseCases must be used inside <UseCasesProvider>');
  }
  return useCases;
};
