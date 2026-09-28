import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { getProgramByDay } from '@/lib/data';

export function ProgramPreview() {
  const day1 = getProgramByDay(1).slice(0, 4);
  const day2 = getProgramByDay(2).slice(0, 4);

  return (
    <section className="section bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="section-subtitle">Programme officiel</p>
          <h2 className="section-title mb-4">Deux soirées d&apos;exception</h2>
          <p className="text-text-secondary max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              19 & 20 novembre 2026
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              Radisson Blu, Conakry
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { day: 1, label: 'Jeudi 19 novembre', items: day1, title: 'Tapis rouge & projection d\'ouverture' },
            { day: 2, label: 'Vendredi 20 novembre', items: day2, title: 'Grande cérémonie des Awards' },
          ].map(({ day, label, items, title }) => (
            <div key={day} className="card-gold p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{label}</p>
                <h3 className="font-serif text-2xl md:text-3xl text-text-primary mt-2">{title}</h3>
              </div>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="shrink-0 flex items-center gap-2 text-gold font-mono text-sm pt-1 w-20">
                      <Clock className="h-3 w-3" />
                      {item.startTime}
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/programme" className="btn-outline-gold">
            Voir le programme complet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
