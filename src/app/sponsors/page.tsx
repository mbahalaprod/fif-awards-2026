import type { Metadata } from 'next';
import { DocumentLink } from '@/components/DocumentLink';
import { DOCUMENTS } from '@/lib/documents';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Mail } from 'lucide-react';
import { getSponsors } from '@/lib/data';
import type { Sponsor, SponsorTier } from '@/types/sponsor';

export const metadata: Metadata = {
  title: 'Sponsors & partenaires',
  description:
    'Le FIF AWARDS 2026 remercie ses partenaires Platine, Or, Argent et Bronze. Découvrez leur engagement et rejoignez la prochaine édition.',
};

const tiers: { tier: SponsorTier; label: string; medal: string; description: string }[] = [
  {
    tier: 'platine',
    label: 'Partenaire Platine',
    medal: '🥇',
    description: 'Partenaire principal, présence exclusive sur l\'ensemble des supports du festival.',
  },
  {
    tier: 'or',
    label: 'Partenaires Or',
    medal: '🥈',
    description: 'Partenaires majeurs, visibilité de premier plan tout au long du festival.',
  },
  {
    tier: 'argent',
    label: 'Partenaires Argent',
    medal: '🥉',
    description: 'Partenaires associés, mention sur les supports clés de la manifestation.',
  },
  {
    tier: 'bronze',
    label: 'Partenaires Bronze',
    medal: '🎖️',
    description: 'Partenaires contributeurs, mention sur les supports digitaux et programmes.',
  },
];

export default async function SponsorsPage() {
  const allSponsors = await getSponsors();
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="section-subtitle">Partenaires officiels</p>
          <h1 className="section-title mb-6">Ils soutiennent le festival</h1>
          <p className="text-text-secondary text-lg">
            Le FIF AWARDS 2026 ne serait pas possible sans l&apos;engagement de partenaires
            visionnaires, convaincus du rôle du cinéma dans le rayonnement de la Guinée.
          </p>
        </div>

        {allSponsors.length === 0 && (
          <p className="text-center text-text-secondary max-w-xl mx-auto">
            La liste des partenaires de l&apos;édition 2026 sera publiée très prochainement.
          </p>
        )}

        {/* Tiers */}
        <div className="space-y-16">
          {tiers.map(({ tier, label, medal, description }) => {
            const sponsors = allSponsors.filter((s) => s.tier === tier);
            if (sponsors.length === 0) return null;
            return (
              <div key={tier}>
                <div className="text-center mb-8">
                  <p className="text-3xl mb-2" aria-hidden="true">
                    {medal}
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-gold">{label}</h2>
                  <p className="text-text-secondary text-sm mt-2 max-w-2xl mx-auto">{description}</p>
                </div>
                <div className={`grid gap-6 ${sponsors.length === 1 ? 'max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                  {sponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Become a partner */}
        <div className="card-gold mt-24 p-8 md:p-16 text-center max-w-3xl mx-auto">
          <p className="section-subtitle">Devenir partenaire</p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">
            Associez votre marque au prestige du FIF AWARDS
          </h2>
          <p className="text-text-secondary mb-8">
            Quatre paliers de partenariat sont disponibles, chacun avec un dispositif de visibilité
            sur mesure. Téléchargez notre dossier ou contactez-nous pour construire un partenariat
            qui vous ressemble.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <DocumentLink
              href={DOCUMENTS.dossierSponsoring}
              label="Dossier de partenariat"
              className="btn-gold"
            />
            <Link href="/contact" className="btn-outline-gold">
              <Mail className="h-4 w-4" /> Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <>
      <div className="relative h-20 mb-4 flex items-center justify-center border-b border-border pb-4">
        {sponsor.logoUrl ? (
          <Image
            src={sponsor.logoUrl}
            alt={sponsor.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain pb-4"
          />
        ) : (
          <span className="font-serif text-xl text-gold text-center">{sponsor.name}</span>
        )}
      </div>
      {sponsor.logoUrl && (
        <p className="font-serif text-lg text-text-primary text-center mb-2">{sponsor.name}</p>
      )}
      {sponsor.description && (
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{sponsor.description}</p>
      )}
      {sponsor.websiteUrl && (
        <span className="inline-flex items-center gap-1 text-xs text-gold group-hover:underline">
          Visiter le site <ExternalLink className="h-3 w-3" />
        </span>
      )}
    </>
  );

  if (!sponsor.websiteUrl) {
    return <div className="card-gold p-6">{content}</div>;
  }
  return (
    <a
      href={sponsor.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card-gold p-6 group block"
    >
      {content}
    </a>
  );
}
