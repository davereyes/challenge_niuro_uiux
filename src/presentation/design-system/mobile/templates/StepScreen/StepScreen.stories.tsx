import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../../atoms/Button';
import { InputText } from '../../atoms/InputText';
import { ScanIllustration } from '../../atoms/ScanIllustration';
import { Text } from '../../atoms/Text';
import { InlineNotice } from '../../molecules/InlineNotice';
import { StatusChecklist } from '../../organisms/StatusChecklist';
import { mobileStory } from '../../../storybook/platform';
import { StepScreen } from './StepScreen';

/**
 * Stories = structural variants of the template. Real pages live in features/apply.
 * Content below is illustrative (static values).
 */
const meta = {
  title: 'Mobile/Templates/StepScreen',
  component: StepScreen,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    children: { control: false },
    actions: { control: false },
    banner: { control: false },
    overlays: { control: false },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: { stepLabel: 'Step 2 of 7', progress: 29, onClose: fn(), onChat: fn(), showFab: true, children: null },
} satisfies Meta<typeof StepScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Form step: title + fields + anchored Continue with back. */
export const FormStep: Story = {
  render: (args) => (
    <StepScreen
      {...args}
      actions={<Button label="Continue" showBackIcon onBack={fn()} disabled />}
    >
      <Text variant="title">What&apos;s your name?</Text>
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <InputText label="First name" value="" onValueChange={fn()} autoComplete="given-name" />
        <InputText label="Last name" value="" onValueChange={fn()} autoComplete="family-name" />
      </div>
    </StepScreen>
  ),
};

/** Automatic screen (1G→): no CTA, no step label. */
export const Automatic: Story = {
  args: { stepLabel: '', progress: 79 },
  render: (args) => (
    <StepScreen {...args}>
      <ScanIllustration />
      <Text variant="title">You&apos;re almost there. Just checking your information.</Text>
      <StatusChecklist
        items={[
          { id: 'a', label: 'Checking if you already have an account', status: 'done' },
          { id: 'b', label: 'Seeing if you can skip some steps', status: 'active' },
          { id: 'c', label: 'Preparing your next step', status: 'pending' },
        ]}
      />
    </StepScreen>
  ),
};

/** 2I · request failed: banner on top, "Try again". */
export const WithErrorBanner: Story = {
  args: { stepLabel: 'Step 6 of 7', progress: 86 },
  render: (args) => (
    <StepScreen
      {...args}
      banner={
        <InlineNotice variant="error" title="We couldn't save your info.">
          Check your connection and try again.
        </InlineNotice>
      }
      actions={<Button label="Try again" showBackIcon onBack={fn()} />}
    >
      <Text variant="title">Where do you live?</Text>
    </StepScreen>
  ),
};
