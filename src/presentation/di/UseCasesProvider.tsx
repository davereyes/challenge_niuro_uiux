import type { ReactNode } from 'react';

import type { UseCases } from '@application/use-cases/UseCases';

import { UseCasesContext } from './UseCasesContext';

export interface UseCasesProviderProps {
  useCases: UseCases;
  children: ReactNode;
}

export const UseCasesProvider = ({ useCases, children }: UseCasesProviderProps) => (
  <UseCasesContext value={useCases}>{children}</UseCasesContext>
);
