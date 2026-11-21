import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import heroImage from '../../../../assets/images/hero-delivery.jpg';
import { SectionHeader } from '../../molecules/SectionHeader';
import { StatItem } from '../../molecules/StatItem';
import { Footer } from '../../organisms/Footer';
import { Hero } from '../../organisms/Hero';
import { mobileStory } from '../../../storybook/platform';
import { LandingPage, LandingSection } from './LandingPage';

/** Structure only; the real landing (with data) is features/landing. */
const meta = {
  title: 'Mobile/Templates/LandingPage',
  component: LandingPage,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  argTypes: { hero: { control: false }, children: { control: false }, footer: { control: false }, overlays: { control: false } },
  args: { hero: null, children: null, footer: null },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LandingPage
      hero={
        <Hero
          imageSrc={heroImage}
          imageAlt="Independent worker handing over a delivery"
          title="Get the support to move"
          titleAccent="forward."
          subtitle="Get up to $10,000 with no credit check."
          ctaLabel="Get Your Advance"
          onCta={fn()}
        />
      }
      footer={<Footer links={[{ label: 'FAQ', href: '#' }]} social={[]} copyright="© 2026 Fundo LLC. All rights reserved." />}
    >
      <LandingSection labelledBy="facts" last>
        <SectionHeader title="A few facts in numbers" titleId="facts" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-7) var(--space-3)' }}>
          <StatItem value="$10K" label="Max advance" />
          <StatItem value="2 min" label="To apply" />
        </div>
      </LandingSection>
    </LandingPage>
  ),
};
