import { useNavigate } from 'react-router';

import {
  Accordion,
  FeatureCard,
  Footer,
  Hero,
  LandingPage as LandingTemplate,
  LandingSection,
  SectionHeader,
  StatItem,
  StepCard,
  Text,
  TextLink,
} from '@ds/mobile';
import audienceGigWorkers from '@presentation/assets/images/audience-gig-workers.jpg';
import heroImage from '@presentation/assets/images/hero-delivery.jpg';
import { holdKeyboard } from '@presentation/hooks/keyboardHandoff';

import { APPLY_PATH } from '../../apply/routing/paths';
import styles from './LandingPage.module.css';

const FAQ = [
  {
    question: 'Does this affect my credit score?',
    answer: 'No, this does not affect your credit score. We do a soft credit check that does not impact your credit score.',
  },
  {
    question: 'How fast can I get funded?',
    answer: 'Most of our customers receive funding within 24-48 hours. In some cases, it can be as fast as the same day.',
  },
  {
    question: 'What are the requirements?',
    answer: 'You must be at least 18 years old, have a valid bank account, and be a U.S. citizen or permanent resident.',
  },
];

const FOOTER_LINKS = [
  { label: 'FAQ', href: '#faq' },
  { label: 'Terms and Conditions', href: '#terms' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'E-Sign Consent', href: '#e-sign' },
  { label: 'Messaging Terms', href: '#messaging-terms' },
];

const SOCIAL = [
  { icon: 'facebook', label: 'Fundo on Facebook', href: '#facebook' },
  { icon: 'linkedin', label: 'Fundo on LinkedIn', href: '#linkedin' },
  { icon: 'instagram', label: 'Fundo on Instagram', href: '#instagram' },
] as const;

/**
 * 1A · Landing.
 * Legal copy: the canvas bundles "and to receive offers by email" with Terms acceptance, which breaks the
 * business rule "Marketing consent is never bundled with Terms acceptance" → that clause is removed here.
 */
export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingTemplate
      hero={
        <Hero
          imageSrc={heroImage}
          imageAlt="Independent worker handing over a delivery"
          title="Get the support to move"
          titleAccent="forward."
          subtitle="Get up to $10,000 with no credit check."
          ctaLabel="Get Your Advance"
          onCta={() => {
            // Contact info opens with the phone field focused: keep the keyboard alive on iOS
            holdKeyboard();
            navigate(APPLY_PATH);
          }}
          legal={
            <p className={styles.legal}>
              By continuing, you agree to our <TextLink tone="inverse" href="#terms">Terms</TextLink> and{' '}
              <TextLink tone="inverse" href="#privacy">Privacy Policy</TextLink>. Protected by reCAPTCHA; Google&apos;s{' '}
              <TextLink tone="inverse" href="https://policies.google.com/privacy">Privacy Policy</TextLink> and{' '}
              <TextLink tone="inverse" href="https://policies.google.com/terms">Terms</TextLink> apply.
            </p>
          }
        />
      }
      footer={<Footer links={FOOTER_LINKS} social={SOCIAL} copyright="© 2026 Fundo LLC. All rights reserved." />}
    >
      <LandingSection labelledBy="audience">
        <SectionHeader eyebrow="Our audience" title="Who we" titleMuted="work with" titleId="audience" />
        <div className={styles.grid}>
          <FeatureCard tone="brand" icon="tools" title="Self-employed" description="Independent contractors such as barbers, cleaners, etc." />
          <FeatureCard tone="neutral" icon="truck" title="Contractors" description="Independent transport such as truck drivers, dispatchers, etc." />
          <FeatureCard
            tone="image"
            icon="smartphone"
            imageSrc={audienceGigWorkers}
            title="Gig Workers"
            description="1099 Gig Workers on Uber, Doordash, Taskrabbit, etc."
          />
          <FeatureCard tone="neutral" icon="store" title="Small Businesses" description="Business owners such as electricians, plumbers, etc." />
        </div>
      </LandingSection>

      <LandingSection labelledBy="facts">
        <Text id="facts" variant="headline" weight="medium" align="center" as="h2">
          A few facts in numbers
        </Text>
        <div className={styles.stats}>
          <StatItem value="$10K" label="Max advance" />
          <StatItem value="2 min" label="To apply" />
          <StatItem value="24–48 h" label="Typical funding" />
          <StatItem value="Same day" label="Fastest funding" />
        </div>
      </LandingSection>

      <LandingSection labelledBy="expect">
        <SectionHeader
          eyebrow="What to expect"
          title="Support that helps you"
          titleMuted="move forward"
          titleId="expect"
          description="Completing our online application is simple, quick, and doesn't affect your credit score at all."
        />
        <div className={styles.steps}>
          <StepCard tone="brand" step={1} title="Apply Online" description="Take two minutes to submit your basic info." />
          <StepCard step={2} title="Get Approved" description="Connect your bank securely to receive a fast decision." />
          <StepCard step={3} title="Get Funded" description="Funds deposited as fast as the same business day." />
        </div>
      </LandingSection>

      <LandingSection labelledBy="faq" last>
        <SectionHeader eyebrow="FAQ" title="Frequently asked" titleMuted="questions" titleId="faq" />
        <Accordion items={FAQ} />
      </LandingSection>
    </LandingTemplate>
  );
};
