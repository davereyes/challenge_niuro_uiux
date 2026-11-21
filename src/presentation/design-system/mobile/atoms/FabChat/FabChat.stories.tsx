import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { FabChat } from './FabChat';

const meta = {
  title: 'Mobile/Atoms/FabChat',
  component: FabChat,
  ...mobileStory,
  args: { label: 'Chat with us', onClick: fn() },
} satisfies Meta<typeof FabChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
