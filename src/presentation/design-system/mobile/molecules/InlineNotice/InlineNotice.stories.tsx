import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { InlineNotice } from './InlineNotice';

/** Each variant matches a canvas usage. Title and text are controls. */
const meta = {
  title: 'Mobile/Molecules/InlineNotice',
  component: InlineNotice,
  ...mobileStory,
  argTypes: { variant: { table: { disable: true } }, icon: { control: false } },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof InlineNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 1H · Home address */
export const Info: Story = {
  args: { variant: 'info', children: "Pick a suggestion and we'll fill in city, state and ZIP." },
};

/** 1D · Income source */
export const Hint: Story = {
  args: { variant: 'hint', title: 'Sell to customers?', children: 'Pick business or gig.' },
};

/** 1I · Identity */
export const Secure: Story = {
  args: {
    variant: 'secure',
    children:
      "As a regulated financial service provider, we're required to collect your SSN to verify your identity. Your information is secured.",
  },
};

/** 2I · Connection error */
export const Error: Story = {
  args: { variant: 'error', title: "We couldn't save your info.", children: 'Check your connection and try again.' },
};
