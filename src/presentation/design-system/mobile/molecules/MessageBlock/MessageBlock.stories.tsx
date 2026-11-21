import type { Meta, StoryObj } from '@storybook/react-vite';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { MessageBlock } from './MessageBlock';

/** Page vs Sheet are layout variants. Icon, tone and copy are controls. */
const meta = {
  title: 'Mobile/Molecules/MessageBlock',
  component: MessageBlock,
  ...mobileStory,
  argTypes: {
    variant: { table: { disable: true } },
    icon: { control: 'select', options: ICON_NAMES },
    tone: { control: 'inline-radio', options: ['brand', 'danger', 'success'] },
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof MessageBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 2E · Income — Not a fit */
export const Page: Story = {
  args: {
    variant: 'page',
    icon: 'info',
    tone: 'brand',
    title: 'Fundo is built for business owners and independent workers',
    description:
      "Based on your answer, we can't offer an advance right now. If you also earn from your own business or gig work, change your answer.",
  },
};

/** 2C · Leave confirmation */
export const Sheet: Story = {
  args: { variant: 'sheet', icon: 'alert-circle', tone: 'danger', title: 'Leave your application?' },
};
