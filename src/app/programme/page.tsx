import type { Metadata } from 'next';
import { Calendar, MapPin, Clock, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getProgramByDay } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Programme officiel',
  description:
    'Déroulé heure par heure des deux soirées du FIF AWARDS 2026 — 19 et 20 novembre, Radisson Blu Conakry.',
};

const typeLabels: Record<string, string> = {
  opening: 'Ouverture',
  screening: 'Projection',
  award: 'Remise de prix',
  performance: 'Performance',
  break: 'Pause',
  closing: 'Clôture',
  networking: 'Networking',
};

export default function ProgrammePage() {
  const day1 = getProgramByDay(1);
  const day2 = getProgramByDay(2);

  return (
    <section className="section">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <p className="section-subtitle">Programme officiel</p>
          <h1 className="section-title mb-6">Deux soirées d&apos;exception</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" /> 19 & 20 novembre 2026
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> Radisson Blu, Conakry
            </span>
          </div>
        </div>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="day1">Jeudi 19 nov.</TabsTrigger>
            <TabsTrigger value="day2">Vendredi 20 nov.</TabsTrigger>
          </TabsList>

          {[
            { key: 'day1', items: day1, title: 'Tapis rouge & projection d\'ouverture' },
            { key: 'day2', items: day2, title: 'Grande cérémonie des Awards' },
          ].map(({ key, items, title }) => (
            <TabsContent key={key} value={key}>
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8 text-center">
                {title}
              </h2>
              <ol className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="card-gold p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="md:w-40 shrink-0 flex md:flex-col items-center md:items-start gap-3">
                      <div className="flex items-center gap-2 text-gold font-mono text-base">
                        <Clock className="h-4 w-4" />
                        {item.startTime} — {item.endTime}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {typeLabels[item.type]}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg md:text-xl text-text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                      {item.speakers && item.speakers.length > 0 && (
                        <p className="text-xs uppercase tracking-wider text-gold mt-3">
                          Intervenant·e·s : {item.speakers.join(' · ')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </TabsContent>
          ))}
        </Tabs>

        {/* Map & PDF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="card-gold overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.0!2d-13.7!3d9.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRadisson%20Blu%20Hotel%20Conakry!5e0!3m2!1sfr!2sgn!4v1700000000000"
              title="Radisson Blu Conakry"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="card-gold p-8 flex flex-col justify-center">
            <h3 className="font-serif text-2xl text-text-primary mb-3">Télécharger le programme</h3>
            <p className="text-text-secondary text-sm mb-6">
              Version PDF imprimable du programme officiel, pratique à conserver et à partager.
            </p>
            <a
              href="/programme.pdf"
              className="btn-outline-gold self-start"
              aria-label="Télécharger le programme officiel au format PDF"
            >
              <Download className="h-4 w-4" /> PDF (à venir)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
