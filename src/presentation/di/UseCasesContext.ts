import { createContext } from 'react';

import type { UseCases } from '@application/use-cases/UseCases';

export const UseCasesContext = createContext<UseCases | null>(null);
