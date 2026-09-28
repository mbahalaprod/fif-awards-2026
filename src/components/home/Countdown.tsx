'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCountdown, type CountdownValue, FESTIVAL_DATE } from '@/lib/countdown';

const labels = {
  days: 'Jours',
  hours: 'Heures',
  minutes: 'Minutes',
  seconds: 'Secondes',
};

export function Countdown() {
  const [value, setValue] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const update = () => setValue(getCountdown());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section bg-background-secondary border-y border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="section-subtitle">Rendez-vous</p>
        <h2 className="section-title mb-4">19 — 20 novembre 2026</h2>
        <p className="text-text-secondary mb-12 max-w-xl mx-auto">
          La cérémonie débute dans :
        </p>

        <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-3xl mx-auto">
          {value && !value.isPast ? (
            (['days', 'hours', 'minutes', 'seconds'] as const).map((key) => (
              <div
                key={key}
                className="card-gold flex flex-col items-center justify-center py-6 md:py-10"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={value[key]}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-gold tabular-nums"
                  >
                    {value[key].toString().padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
                <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-text-secondary mt-3">
                  {labels[key]}
                </span>
              </div>
            ))
          ) : value?.isPast ? (
            <div className="col-span-4 text-center">
              <p className="font-serif text-3xl md:text-4xl text-gold">
                Le festival a commencé. Bienvenue !
              </p>
            </div>
          ) : (
            // SSR placeholder
            (['days', 'hours', 'minutes', 'seconds'] as const).map((key) => (
              <div
                key={key}
                className="card-gold flex flex-col items-center justify-center py-6 md:py-10"
              >
                <span className="font-serif text-4xl md:text-6xl lg:text-7xl text-gold tabular-nums">
                  --
                </span>
                <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-text-secondary mt-3">
                  {labels[key]}
                </span>
              </div>
            ))
          )}
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary mt-10">
          Radisson Blu Hôtel — Conakry, Guinée · {FESTIVAL_DATE.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </section>
  );
}
