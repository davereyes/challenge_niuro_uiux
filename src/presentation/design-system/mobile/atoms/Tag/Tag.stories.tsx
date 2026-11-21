import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { Tag } from './Tag';

const meta = {
  title: 'Mobile/Atoms/Tag',
  component: Tag,
  ...mobileStory,
  args: { label: 'Our audience' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
