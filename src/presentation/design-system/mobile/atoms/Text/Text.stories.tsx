import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { Text, type TextVariant } from './Text';

const VARIANTS: TextVariant[] = [
  'display',
  'title',
  'heading',
  'section',
  'stat',
  'headline',
  'lead',
  'body',
  'bodySmall',
  'callout',
  'caption',
  'micro',
];

/** Each typographic level is a variant (story). Tone, alignment, weight and truncate are controls. */
const meta = {
  title: 'Mobile/Atoms/Text',
  component: Text,
  ...mobileStory,
  argTypes: {
    variant: { table: { disable: true } },
    as: { table: { disable: true } },
    tone: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'brand', 'accent', 'danger', 'inverse', 'inverseMuted'],
    },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    weight: { control: 'select', options: [undefined, 'regular', 'medium', 'semibold', 'bold'] },
  },
  args: { children: 'Get the support to move forward.', tone: 'primary', align: 'start', truncate: false },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = { args: { variant: 'display' } };
export const Title: Story = { args: { variant: 'title' } };
export const Heading: Story = { args: { variant: 'heading' } };
export const Section: Story = { args: { variant: 'section' } };
export const Stat: Story = { args: { variant: 'stat', children: '$10K' } };
export const Headline: Story = { args: { variant: 'headline' } };
export const Lead: Story = { args: { variant: 'lead' } };
export const Body: Story = { args: { variant: 'body' } };
export const BodySmall: Story = { args: { variant: 'bodySmall' } };
export const Callout: Story = { args: { variant: 'callout' } };
export const Caption: Story = { args: { variant: 'caption' } };
export const Micro: Story = { args: { variant: 'micro' } };

/** Type scale overview (docs only). */
export const Scale: Story = {
  tags: ['!test'],
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {VARIANTS.map((variant) => (
        <Text key={variant} variant={variant} as="p">
          {variant} — {args.children}
        </Text>
      ))}
    </div>
  ),
};
