import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { getTickets } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { TicketForm } from '@/components/billetterie/TicketForm';

export const metadata: Metadata = {
  title: 'Billetterie',
  description:
    'Réservez vos billets pour la cérémonie du FIF AWARDS 2026 — formules Standard, VIP et Premium.',
};

export default function BilletteriePage() {
  const tickets = getTickets();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Cérémonie du 20 novembre 2026</p>
          <h1 className="section-title mb-6">Billetterie officielle</h1>
          <p className="text-text-secondary text-lg">
            Trois formules pour vivre la cérémonie selon vos envies — du tapis rouge à
            l&apos;after-party officielle.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tickets.map((ticket, idx) => {
            const isVip = ticket.id === 'vip';
            return (
              <div
                key={ticket.id}
                className={`card-gold p-6 md:p-8 flex flex-col ${isVip ? 'ring-2 ring-gold/50' : ''}`}
              >
                {isVip && (
                  <span className="self-start text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
                    Le plus populaire
                  </span>
                )}
                <h3 className="font-serif text-2xl text-text-primary mb-2">{ticket.name}</h3>
                <p className="font-serif text-3xl text-gold mb-4">
                  {formatCurrency(ticket.price, ticket.currency)}
                </p>
                <p className="text-sm text-text-secondary mb-6">{ticket.description}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {ticket.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#reserver" className="btn-outline-gold w-full">
                  Choisir cette formule
                </a>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div id="reserver" className="scroll-mt-24">
          <TicketForm tickets={tickets} />
        </div>
      </div>
    </section>
  );
}
