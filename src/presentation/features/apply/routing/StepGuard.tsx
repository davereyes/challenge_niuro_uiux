import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import type { StepId } from '@domain/entities/ApplicationDraft';
import { canAccessStep, firstIncompleteStep } from '@domain/services/applyFlow';

import { useApplyFlow } from '../state/useApplyFlow';
import { stepPath } from './paths';

export interface StepGuardProps {
  step: StepId;
  children: ReactNode;
}

/** Deep links to a step whose previous steps are not done redirect to the first incomplete one. */
export const StepGuard = ({ step, children }: StepGuardProps) => {
  const { draft } = useApplyFlow();
  if (canAccessStep(draft, step)) return children;
  return <Navigate to={stepPath(firstIncompleteStep(draft) ?? 'contact')} replace />;
};
