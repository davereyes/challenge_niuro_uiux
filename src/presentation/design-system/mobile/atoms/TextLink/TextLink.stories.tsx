import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { TextLink } from './TextLink';

/** Inline (legal copy) vs Standalone (2G "Notify me") are variants; tone is a control. */
const meta = {
  title: 'Mobile/Atoms/TextLink',
  component: TextLink,
  ...mobileStory,
  argTypes: {
    size: { table: { disable: true } },
    tone: { control: 'inline-radio', options: ['brand', 'inverse'] },
  },
  args: { tone: 'brand', children: 'Messaging Terms', href: '#' },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: { size: 'inherit' },
  render: (args) => (
    <p style={{ fontSize: 'var(--font-size-12)', lineHeight: 'var(--line-height-18)', color: 'var(--color-text-muted)' }}>
      Msg &amp; data rates may apply. Reply STOP to opt out. <TextLink {...args} />
    </p>
  ),
};

export const Standalone: Story = {
  args: { size: 'callout', children: "Notify me when it's available", href: undefined, onClick: fn() },
};
