import type { Metadata } from 'next';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { getEditions } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Éditions précédentes',
  description:
    'Retour en images sur les trois premières éditions du FIF AWARDS — 2023, 2024 et 2025.',
};

export default function EditionsPage() {
  const editions = getEditions();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Archives du festival</p>
          <h1 className="section-title mb-6">Éditions précédentes</h1>
          <p className="text-text-secondary text-lg">
            Trois éditions qui ont construit, année après année, l&apos;identité du FIF AWARDS.
          </p>
        </div>

        <div className="space-y-20">
          {editions.map((edition, idx) => (
            <article key={edition.year} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className={`relative aspect-[4/5] rounded-lg overflow-hidden border border-border ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Image
                  src={edition.coverImage}
                  alt={`FIF AWARDS ${edition.year}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-7xl md:text-8xl text-gold mb-4">{edition.year}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-text-secondary mb-2">Thème</p>
                <h2 className="font-serif text-3xl text-text-primary mb-6">{edition.theme}</h2>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Films', value: edition.films },
                    { label: 'Invités', value: edition.attendees },
                    { label: 'Prix', value: edition.awards },
                    { label: 'Sponsors', value: edition.sponsors },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-serif text-2xl text-gold">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3 flex items-center gap-2">
                    <Trophy className="h-3 w-3" /> Principaux lauréats
                  </p>
                  <ul className="space-y-2 text-sm">
                    {edition.topLaureates.map((l) => (
                      <li key={l.category} className="flex items-baseline gap-3">
                        <span className="text-text-secondary shrink-0">{l.category} :</span>
                        <span className="text-text-primary">{l.winner}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mini gallery */}
                <div className="grid grid-cols-3 gap-2 mt-8">
                  {edition.gallery.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden border border-border">
                      <Image src={src} alt={`Photo ${i + 1} - ${edition.year}`} fill sizes="120px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
