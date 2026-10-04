import { Hero } from '@/components/home/Hero';
import { Countdown } from '@/components/home/Countdown';
import { SponsorsCarousel } from '@/components/home/SponsorsCarousel';
import { DistinguesPreview } from '@/components/home/DistinguesPreview';
import { getSettings } from '@/lib/data';
import { ProgramPreview } from '@/components/home/ProgramPreview';
import { PreviousEditionsGallery } from '@/components/home/PreviousEditionsGallery';

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'FIF AWARDS 2026 — 4ᵉ édition',
  description:
    'Festival International du Film AWARDS, 4ᵉ édition. Cérémonie de remise des prix du cinéma guinéen.',
  startDate: '2026-11-19T17:00:00+00:00',
  endDate: '2026-11-21T01:00:00+00:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Radisson Blu Hôtel Conakry',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Conakry',
      addressCountry: 'GN',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: "Comité d'Organisation FIF AWARDS",
    url: 'https://fifawards.gn',
  },
};

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Hero voteActive={settings.voteActive} slogan={settings.slogan} />
      <Countdown />
      <DistinguesPreview />
      <SponsorsCarousel />
      <ProgramPreview />
      <PreviousEditionsGallery />
    </>
  );
}
