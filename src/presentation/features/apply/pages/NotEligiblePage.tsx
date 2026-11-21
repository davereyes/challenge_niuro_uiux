import { useNavigate } from 'react-router';

import { Button, MessageBlock } from '@ds/mobile';
import { holdKeyboard } from '@presentation/hooks/keyboardHandoff';

import { ApplyStep } from '../components/ApplyStep';
import { LANDING_PATH, stepPath } from '../routing/paths';

/**
 * 2E · Income — Not a fit ("A job or other income").
 * "Explore other options" has no defined destination yet [Assumed]: goes to the landing for now.
 */
export const NotEligiblePage = () => {
  const navigate = useNavigate();
  return (
    <ApplyStep
      step="income"
      actions={
        <>
          <Button label="Change my answer" onClick={() => {
            holdKeyboard();
            navigate(stepPath('income'));
          }} />
          <Button variant="tertiary" label="Explore other options" onClick={() => navigate(LANDING_PATH)} />
        </>
      }
    >
      <MessageBlock
        icon="info"
        tone="brand"
        title="Fundo is built for business owners and independent workers"
        description="Based on your answer, we can't offer an advance right now. If you also earn from your own business or gig work, change your answer."
      />
    </ApplyStep>
  );
};
