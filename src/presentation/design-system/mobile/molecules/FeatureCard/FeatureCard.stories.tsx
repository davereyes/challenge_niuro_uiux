import type { Meta, StoryObj } from '@storybook/react-vite';

import gigWorkers from '../../../../assets/images/audience-gig-workers.jpg';
import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { FeatureCard } from './FeatureCard';

/** Tones are variants (brand, neutral, image). Copy and icon are controls. */
const meta = {
  title: 'Mobile/Molecules/FeatureCard',
  component: FeatureCard,
  ...mobileStory,
  argTypes: { tone: { table: { disable: true } }, icon: { control: 'select', options: ICON_NAMES } },
  decorators: [(Story) => <div style={{ width: '10.125rem' }}><Story /></div>],
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {
  args: { tone: 'brand', icon: 'tools', title: 'Self-employed', description: 'Independent contractors such as barbers, cleaners, etc.' },
};

export const Neutral: Story = {
  args: { tone: 'neutral', icon: 'truck', title: 'Contractors', description: 'Independent transport such as truck drivers, dispatchers, etc.' },
};

export const Image: Story = {
  args: {
    tone: 'image',
    icon: 'smartphone',
    imageSrc: gigWorkers,
    title: 'Gig Workers',
    description: '1099 Gig Workers on Uber, Doordash, Taskrabbit, etc.',
  },
};
