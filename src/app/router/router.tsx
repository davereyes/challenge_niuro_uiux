import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';

import type { StepId } from '@domain/entities/ApplicationDraft';
import {
  AddressPage,
  ApplyLayout,
  BusinessPage,
  CheckingPage,
  ContactPage,
  IdentityPage,
  IncomeSourcePage,
  NamePage,
  NotEligiblePage,
  OUTCOME_SEGMENTS,
  OutcomePage,
  OwnershipPage,
  STEP_SEGMENTS,
  StepGuard,
} from '@presentation/features/apply';
import { LandingPage } from '@presentation/features/landing';

const STEP_PAGES: Record<StepId, () => React.JSX.Element> = {
  contact: ContactPage,
  name: NamePage,
  income: IncomeSourcePage,
  business: BusinessPage,
  ownership: OwnershipPage,
  checking: CheckingPage,
  address: AddressPage,
  identity: IdentityPage,
};

const stepRoutes: RouteObject[] = (Object.keys(STEP_PAGES) as StepId[]).map((step) => {
  const Page = STEP_PAGES[step];
  return {
    path: STEP_SEGMENTS[step],
    element: (
      <StepGuard step={step}>
        <Page />
      </StepGuard>
    ),
  };
});

/** All routes of the app. Pages come from presentation/features; guards keep the flow order. */
export const routes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  {
    path: '/apply',
    element: <ApplyLayout />,
    children: [
      { index: true, element: <Navigate to={STEP_SEGMENTS.contact} replace /> },
      ...stepRoutes,
      {
        path: OUTCOME_SEGMENTS.incomeNotEligible,
        element: (
          <StepGuard step="income">
            <NotEligiblePage />
          </StepGuard>
        ),
      },
      { path: OUTCOME_SEGMENTS.gigBranch, element: <OutcomePage outcome="gig" /> },
      { path: OUTCOME_SEGMENTS.minorityOwnerBranch, element: <OutcomePage outcome="minorityOwner" /> },
      {
        path: OUTCOME_SEGMENTS.bankConnection,
        element: (
          <StepGuard step="identity">
            <OutcomePage outcome="bank" />
          </StepGuard>
        ),
      },
      { path: '*', element: <Navigate to={STEP_SEGMENTS.contact} replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

export const createAppRouter = () => createBrowserRouter(routes);
