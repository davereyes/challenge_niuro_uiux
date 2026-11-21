import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../../atoms/Button';
import { mobileStory } from '../../../storybook/platform';
import { BottomActionBar } from './BottomActionBar';

/**
 * Stories = composition patterns from the canvas. `note` is a control.
 * In the app `position="fixed"`: it rides on top of the keyboard (VisualViewport).
 */
const meta = {
  title: 'Mobile/Organisms/BottomActionBar',
  component: BottomActionBar,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  argTypes: { children: { control: false }, position: { control: 'inline-radio', options: ['static', 'fixed'] } },
  args: { position: 'static', note: undefined, children: null },
} satisfies Meta<typeof BottomActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every step: Continue + back (project rule). */
export const StepCta: Story = {
  render: (args) => (
    <BottomActionBar {...args}>
      <Button label="Continue" showBackIcon onBack={fn()} onClick={fn()} />
    </BottomActionBar>
  ),
};

/** 2H · slow request: loading + "Still working…" */
export const Saving: Story = {
  args: { note: 'Still working…' },
  render: (args) => (
    <BottomActionBar {...args}>
      <Button label="Continue" showBackIcon loading onBack={fn()} />
    </BottomActionBar>
  ),
};

/** 2E · two stacked actions */
export const TwoActions: Story = {
  render: (args) => (
    <BottomActionBar {...args}>
      <Button label="Change my answer" showBackIcon onBack={fn()} />
      <Button variant="tertiary" label="Explore other options" />
    </BottomActionBar>
  ),
};
