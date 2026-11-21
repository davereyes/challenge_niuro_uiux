import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { StatusItem } from './StatusItem';

/** `status` is a state → control. */
const meta = {
  title: 'Mobile/Molecules/StatusItem',
  component: StatusItem,
  ...mobileStory,
  argTypes: { status: { control: 'inline-radio', options: ['pending', 'active', 'done'] } },
  args: { label: 'Checking if you already have an account', status: 'active' },
  decorators: [(Story) => <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}><Story /></ul>],
} satisfies Meta<typeof StatusItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
