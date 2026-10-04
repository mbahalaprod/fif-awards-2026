import Link from 'next/link';
import Image from 'next/image';
import { getSponsors } from '@/lib/data';

export async function SponsorsCarousel() {
  const sponsors = await getSponsors();
  if (sponsors.length === 0) return null;
  // Duplicate list for seamless infinite marquee
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className="py-16 bg-background-primary overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 text-center mb-10">
        <p className="section-subtitle">Ils soutiennent le festival</p>
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary">
          Nos partenaires officiels
        </h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-background-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-background-primary to-transparent z-10 pointer-events-none" />

        <div className="marquee-track gap-12 md:gap-16">
          {doubled.map((sponsor, idx) => (
            <div
              key={`${sponsor.id}-${idx}`}
              className="shrink-0 flex flex-col items-center justify-center px-4"
              aria-hidden={idx >= sponsors.length}
            >
              <div className="relative h-16 md:h-20 w-44 md:w-56 rounded-md border border-border bg-background-secondary flex items-center justify-center px-6">
                {sponsor.logoUrl ? (
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    sizes="224px"
                    className="object-contain p-3"
                  />
                ) : (
                  <span className="font-serif text-base md:text-lg text-gold text-center leading-tight">
                    {sponsor.name}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mt-2">
                {sponsor.tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/sponsors" className="btn-outline-gold">
          Voir tous les partenaires
        </Link>
      </div>
    </section>
  );
}
