import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { StatItem } from './StatItem';

const meta = {
  title: 'Mobile/Molecules/StatItem',
  component: StatItem,
  ...mobileStory,
  args: { value: '$10K', label: 'Max advance' },
} satisfies Meta<typeof StatItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
