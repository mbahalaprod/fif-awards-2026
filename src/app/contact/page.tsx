import type { Metadata } from 'next';
import { MapPin, Mail, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe du FIF AWARDS 2026 — candidatures, partenariats, presse.',
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Nous écrire</p>
          <h1 className="section-title mb-6">Contact</h1>
          <p className="text-text-secondary text-lg">
            Une question, un projet de partenariat, une demande presse ? Notre équipe vous répond
            sous 48 heures ouvrées.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="card-gold p-6">
              <h2 className="font-serif text-xl text-gold mb-4">Coordonnées</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-primary">Radisson Blu Hôtel Conakry</p>
                    <p className="text-text-secondary">Corniche Sud, Conakry, Guinée</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <a
                    href="mailto:contact@fifawards.gn"
                    className="text-text-primary hover:text-gold transition-colors"
                  >
                    contact@fifawards.gn
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <a
                    href="tel:+224000000000"
                    className="text-text-primary hover:text-gold transition-colors"
                  >
                    +224 000 000 000
                  </a>
                </li>
              </ul>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Youtube, label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="card-gold overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.0!2d-13.7!3d9.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRadisson%20Blu%20Hotel%20Conakry!5e0!3m2!1sfr!2sgn!4v1700000000000"
                title="Radisson Blu Conakry"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
