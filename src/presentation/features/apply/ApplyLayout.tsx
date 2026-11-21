import { Fragment, Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { useUseCases } from '@presentation/di';

import { ResumeSheet } from './components/ResumeSheet';
import { APPLY_PATH, stepPath } from './routing/paths';
import { ApplyFlowProvider } from './state/ApplyFlowProvider';
import { useApplyFlow } from './state/useApplyFlow';

/** Remounts the current screen after "Start over" so local form state resets. */
const FlowOutlet = () => {
  const { session } = useApplyFlow();
  return (
    <Fragment key={session}>
      <Outlet />
    </Fragment>
  );
};

/** Route layout for /apply/*: loads cached progress once, offers to resume (2D) when entering the flow. */
export const ApplyLayout = () => {
  const { apply } = useUseCases();
  const { pathname } = useLocation();
  const [loaded] = useState(() => apply.getDraft.execute());
  const [offerResume] = useState(() => pathname === APPLY_PATH || pathname === `${APPLY_PATH}/` || pathname === stepPath('contact'));

  return (
    <Suspense fallback={null}>
      <ApplyFlowProvider loaded={loaded} offerResume={offerResume}>
        <FlowOutlet />
        <ResumeSheet />
      </ApplyFlowProvider>
    </Suspense>
  );
};
