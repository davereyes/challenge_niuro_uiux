import type { Meta, StoryObj } from '@storybook/react-vite';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { Icon } from './Icon';

const meta = {
  title: 'Mobile/Atoms/Icon',
  component: Icon,
  ...mobileStory,
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: { name: 'search', size: 'md' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Catalog of every registered icon. */
export const Gallery: Story = {
  parameters: { controls: { include: ['size'] } },
  render: ({ size }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {ICON_NAMES.map((name) => (
        <div key={name} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--font-size-12)' }}>
          <Icon name={name} {...(size ? { size } : {})} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
