import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { Accordion } from './Accordion';

const meta = {
  title: 'Mobile/Organisms/Accordion',
  component: Accordion,
  ...mobileStory,
  argTypes: { items: { control: false } },
  args: {
    defaultOpenIndex: 0,
    items: [
      { question: 'Does this affect my credit score?', answer: 'No, this does not affect your credit score. We do a soft credit check that does not impact your credit score.' },
      { question: 'How fast can I get funded?', answer: 'Most of our customers receive funding within 24-48 hours. In some cases, it can be as fast as the same day.' },
      { question: 'What are the requirements?', answer: 'You must be at least 18 years old, have a valid bank account, and be a U.S. citizen or permanent resident.' },
    ],
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
