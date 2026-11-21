import { use } from 'react';

import { ApplyFlowContext, type ApplyFlowState } from './ApplyFlowContext';

export const useApplyFlow = (): ApplyFlowState => {
  const state = use(ApplyFlowContext);
  if (!state) throw new Error('useApplyFlow must be used inside <ApplyFlowProvider>');
  return state;
};
