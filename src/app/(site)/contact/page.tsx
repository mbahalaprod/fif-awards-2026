import type { Metadata } from 'next';
import { MapPin, Mail, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe du FIF AWARDS 2026 — candidatures, partenariats, presse.',
};

export default async function ContactPage() {
  const settings = await getSettings();
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
                  <p className="text-text-primary">{settings.address}</p>
                </li>
                {settings.email && (
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-text-primary hover:text-gold transition-colors break-all"
                    >
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, '')}`}
                      className="text-text-primary hover:text-gold transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </li>
                )}
              </ul>
              <SocialLinks
                settings={settings}
                size="md"
                className="mt-6 pt-6 border-t border-border"
              />
            </div>

            <div className="card-gold overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Radisson+Blu+Hotel+Conakry&output=embed"
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
