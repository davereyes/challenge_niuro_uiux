import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { StatusChecklist } from './StatusChecklist';

/** Item statuses are data (control). Canvas copy. */
const meta = {
  title: 'Mobile/Organisms/StatusChecklist',
  component: StatusChecklist,
  ...mobileStory,
  args: {
    items: [
      { id: 'account', label: 'Checking if you already have an account', status: 'done' },
      { id: 'skip', label: 'Seeing if you can skip some steps', status: 'active' },
      { id: 'next', label: 'Preparing your next step', status: 'pending' },
    ],
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof StatusChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
