import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { StepCard } from './StepCard';

const meta = {
  title: 'Mobile/Molecules/StepCard',
  component: StepCard,
  ...mobileStory,
  argTypes: { tone: { table: { disable: true } } },
  args: { step: 1, title: 'Apply Online', description: 'Take two minutes to submit your basic info.' },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof StepCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = { args: { tone: 'brand' } };
export const Neutral: Story = {
  args: { tone: 'neutral', step: 2, title: 'Get Approved', description: 'Connect your bank securely to receive a fast decision.' },
};
