import { StrictMode, useState, type ReactNode } from 'react';

import { UseCasesProvider } from '@presentation/di';

import { createContainer } from '../di/container';

export interface AppProvidersProps {
  children: ReactNode;
}

/** Global providers. Add router, query client, theme, i18n... here. */
export const AppProviders = ({ children }: AppProvidersProps) => {
  const [useCases] = useState(createContainer);

  return (
    <StrictMode>
      <UseCasesProvider useCases={useCases}>{children}</UseCasesProvider>
    </StrictMode>
  );
};
