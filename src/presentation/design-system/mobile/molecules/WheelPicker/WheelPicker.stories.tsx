import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { WheelPicker } from './WheelPicker';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Demo = () => {
  const [month, setMonth] = useState('10');
  const [year, setYear] = useState('2026');
  return (
    <div style={{ width: '23.375rem', paddingTop: 'var(--space-4)', background: 'var(--color-bg-surface)' }}>
      <WheelPicker
        columns={[
          {
            id: 'month',
            label: 'Month',
            value: month,
            onChange: setMonth,
            flex: 1.5,
            // future months of the current year are unavailable
            items: MONTHS.map((name, index) => ({ value: String(index), label: name, disabled: year === '2026' && index > 10 })),
          },
          {
            id: 'year',
            label: 'Year',
            value: year,
            onChange: setYear,
            align: 'end',
            items: ['2026', '2025', '2024', '2023', '2022'].map((value) => ({ value, label: value })),
          },
        ]}
      />
    </div>
  );
};

/** Scroll, tap or use ↑/↓. December 2026 is unavailable: the wheel bounces back to November. */
const meta = {
  title: 'Mobile/Molecules/WheelPicker',
  component: WheelPicker,
  ...mobileStory,
  render: () => <Demo />,
  args: { columns: [] },
  argTypes: { columns: { control: false } },
} satisfies Meta<typeof WheelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const month = canvas.getByRole('spinbutton', { name: 'Month' });
    await expect(month).toHaveAttribute('aria-valuetext', 'November');
    month.focus();
    await userEvent.keyboard('{ArrowDown}');
    // December is disabled in 2026 → stays on November
    await expect(month).toHaveAttribute('aria-valuetext', 'November');
    await userEvent.keyboard('{ArrowUp}');
    await expect(month).toHaveAttribute('aria-valuetext', 'October');
  },
};
