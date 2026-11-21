import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { ScanIllustration } from './ScanIllustration';

const meta = {
  title: 'Mobile/Atoms/ScanIllustration',
  component: ScanIllustration,
  ...mobileStory,
} satisfies Meta<typeof ScanIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
