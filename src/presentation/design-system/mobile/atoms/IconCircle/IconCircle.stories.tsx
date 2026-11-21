import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { IconCircle } from './IconCircle';

/**
 * Tones are variants (each matches a canvas usage). Size and icon are controls.
 * surface: option cards · brand: info/resume · danger: leave sheet · success: account found.
 */
const meta = {
  title: 'Mobile/Atoms/IconCircle',
  component: IconCircle,
  ...mobileStory,
  argTypes: {
    tone: { table: { disable: true } },
    children: { control: false },
    icon: { control: 'select', options: ICON_NAMES },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  args: { size: 'lg', icon: 'info' },
} satisfies Meta<typeof IconCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

const onGray: Decorator[] = [(Story) => <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-subtle)' }}><Story /></div>];
const onBrand: Decorator[] = [(Story) => <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-brand)' }}><Story /></div>];

export const Surface: Story = { args: { tone: 'surface', size: 'md', icon: 'store' }, decorators: onGray };
export const Brand: Story = { args: { tone: 'brand' } };
export const Danger: Story = { args: { tone: 'danger', icon: 'alert-circle' } };
export const Success: Story = { args: { tone: 'success', icon: 'check-circle' } };
export const OnBrand: Story = { args: { tone: 'onBrand', size: 'md', icon: 'tools' }, decorators: onBrand };
