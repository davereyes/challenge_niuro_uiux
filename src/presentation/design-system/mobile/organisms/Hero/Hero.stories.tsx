import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import heroImage from '../../../../assets/images/hero-delivery.jpg';
import { TextLink } from '../../atoms/TextLink';
import { mobileStory } from '../../../storybook/platform';
import { Hero } from './Hero';

const meta = {
  title: 'Mobile/Organisms/Hero',
  component: Hero,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  argTypes: { legal: { control: false } },
  args: {
    imageSrc: heroImage,
    imageAlt: 'Independent worker handing over a delivery',
    title: 'Get the support to move',
    titleAccent: 'forward.',
    subtitle: 'Get up to $10,000 with no credit check.',
    ctaLabel: 'Get Your Advance',
    onCta: fn(),
    showScrollHint: true,
    legal: (
      <p style={{ margin: 0 }}>
        By continuing, you agree to our <TextLink tone="inverse" href="#">Terms</TextLink> and{' '}
        <TextLink tone="inverse" href="#">Privacy Policy</TextLink>.
      </p>
    ),
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: args.ctaLabel }));
    await expect(args.onCta).toHaveBeenCalledOnce();
  },
};
