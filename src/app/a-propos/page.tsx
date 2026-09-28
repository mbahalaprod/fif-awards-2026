import type { Metadata } from 'next';
import Image from 'next/image';
import { Trophy, Users, Film, Heart } from 'lucide-react';
import { getEditions } from '@/lib/data';

export const metadata: Metadata = {
  title: 'À propos du FIF AWARDS',
  description:
    'Histoire, vision et valeurs du Festival International de Film AWARDS. Découvrez le projet porté par le Comité d\'Organisation depuis 2023.',
};

export default function AProposPage() {
  const editions = getEditions();
  const totalAttendees = editions.reduce((sum, e) => sum + e.attendees, 0);
  const totalFilms = editions.reduce((sum, e) => sum + e.films, 0);
  const totalAwards = editions.reduce((sum, e) => sum + e.awards, 0);

  return (
    <article className="section">
      <div className="container mx-auto px-4 max-w-4xl">
        <p className="section-subtitle text-center">Notre histoire</p>
        <h1 className="section-title text-center mb-12">À propos du FIF AWARDS</h1>

        <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed space-y-6 mb-16">
          <p className="text-xl text-text-primary">
            Le Festival International de Film AWARDS est né d&apos;une conviction simple : le cinéma
            guinéen mérite son écrin. Une scène où l&apos;on célèbre les œuvres, mais aussi celles et
            ceux qui les rendent possibles.
          </p>
          <p>
            Depuis 2023, le festival rassemble chaque année à Conakry réalisateurs, comédiens,
            ingénieurs du son, scénaristes, monteurs, directeurs de la photographie, journalistes,
            partenaires et passionnés. À l&apos;image des grands rendez-vous internationaux du
            septième art, le FIF AWARDS valorise toute la chaîne de valeur d&apos;une œuvre — pas
            seulement ce qui se passe devant l&apos;objectif.
          </p>
          <p>
            Quatre éditions, dix catégories, et un objectif partagé : faire rayonner la création
            audiovisuelle guinéenne, en Guinée et au-delà.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Film, value: totalFilms, label: 'Films présentés' },
            { icon: Users, value: totalAttendees.toLocaleString('fr-FR'), label: 'Invités cumulés' },
            { icon: Trophy, value: totalAwards, label: 'Prix décernés' },
            { icon: Heart, value: '4ᵉ', label: 'Édition en 2026' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="card-gold p-6 text-center">
              <Icon className="h-6 w-6 text-gold mx-auto mb-3" />
              <p className="font-serif text-3xl text-text-primary">{value}</p>
              <p className="text-xs uppercase tracking-wider text-text-secondary mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Vision, Mission, Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Vision',
              body: 'Faire du FIF AWARDS le rendez-vous incontournable du cinéma guinéen et un pont vers la scène africaine et internationale.',
            },
            {
              title: 'Mission',
              body: 'Reconnaître l\'excellence dans tous les métiers du cinéma, soutenir la nouvelle génération et structurer durablement la filière.',
            },
            {
              title: 'Valeurs',
              body: 'Exigence artistique, équité dans la sélection, transparence dans le vote, hospitalité et respect du travail des équipes.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="card-gold p-6">
              <h3 className="font-serif text-xl text-gold mb-3">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Message du président */}
        <div className="card-gold p-8 md:p-12 relative">
          <p className="font-serif text-6xl text-gold/30 absolute top-4 left-4" aria-hidden="true">
            “
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4 mt-6">
            Le mot du président
          </h2>
          <p className="text-text-secondary leading-relaxed italic mb-4">
            « Cette 4ᵉ édition est celle de la maturité. Nous avons construit, brique après brique,
            un festival qui ressemble à notre cinéma : exigeant, ouvert et profondément ancré. Nous
            voulons que le FIF AWARDS soit la maison commune de toutes les femmes et de tous les
            hommes qui font notre septième art. »
          </p>
          <p className="text-sm uppercase tracking-wider text-gold">
            — Le président du Comité d&apos;Organisation
          </p>
        </div>

        {/* Gallery */}
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary mt-16 mb-8 text-center">
          Souvenirs des éditions précédentes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {editions.flatMap((e) => e.gallery.slice(0, 1).map((src) => ({ src, year: e.year }))).map(
            (img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <Image
                  src={img.src}
                  alt={`Édition ${img.year}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background-primary to-transparent">
                  <span className="text-xs uppercase tracking-wider text-gold">{img.year}</span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </article>
  );
}
