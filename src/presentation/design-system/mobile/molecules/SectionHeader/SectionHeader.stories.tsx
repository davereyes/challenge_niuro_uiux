import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { SectionHeader } from './SectionHeader';

const meta = {
  title: 'Mobile/Molecules/SectionHeader',
  component: SectionHeader,
  ...mobileStory,
  args: {
    eyebrow: 'What to expect',
    title: 'Support that helps you',
    titleMuted: 'move forward',
    description: "Completing our online application is simple, quick, and doesn't affect your credit score at all.",
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
