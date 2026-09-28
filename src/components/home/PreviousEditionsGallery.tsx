import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getEditions } from '@/lib/data';

export function PreviousEditionsGallery() {
  const editions = getEditions();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="section-subtitle">Notre histoire</p>
          <h2 className="section-title mb-4">Éditions précédentes</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Trois éditions, plus de 100 films présentés, des dizaines de lauréats et un public
            chaque année plus nombreux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {editions.map((edition) => (
            <article
              key={edition.year}
              className="card-gold overflow-hidden group relative"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={edition.coverImage}
                  alt={`FIF AWARDS ${edition.year}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/40 to-transparent" />

                <div className="absolute top-6 left-6">
                  <span className="font-serif text-5xl md:text-6xl text-gold">{edition.year}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Édition</p>
                  <h3 className="font-serif text-xl text-text-primary mb-4 leading-tight">
                    {edition.theme}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="font-serif text-xl text-gold">{edition.films}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                        Films
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-xl text-gold">{edition.attendees}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                        Invités
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-xl text-gold">{edition.sponsors}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                        Sponsors
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/editions-precedentes" className="btn-outline-gold">
            Galerie complète <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
