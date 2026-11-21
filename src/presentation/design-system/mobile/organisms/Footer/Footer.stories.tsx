import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { Footer } from './Footer';

const meta = {
  title: 'Mobile/Organisms/Footer',
  component: Footer,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  argTypes: { links: { control: false }, social: { control: false } },
  args: {
    copyright: '© 2026 Fundo LLC. All rights reserved.',
    social: [
      { icon: 'facebook', label: 'Fundo on Facebook', href: '#' },
      { icon: 'linkedin', label: 'Fundo on LinkedIn', href: '#' },
      { icon: 'instagram', label: 'Fundo on Instagram', href: '#' },
    ],
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Terms and Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'E-Sign Consent', href: '#' },
      { label: 'Messaging Terms', href: '#' },
    ],
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
