import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';
import type { SiteSettings } from '@/types/settings';
import { SocialLinks } from './SocialLinks';

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo-fond-sombre.png"
                alt="FIF Awards — Festival International du Film Awards"
                width={180}
                height={90}
                className="h-20 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Festival International du Film AWARDS. 4ᵉ édition les 19 et 20 novembre 2026 à Conakry,
              au Radisson Blu.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
              {settings.slogan}
            </p>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">Festival</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/a-propos" className="text-text-secondary hover:text-gold transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/distingues" className="text-text-secondary hover:text-gold transition-colors">
                  Les distingués 2026
                </Link>
              </li>
              <li>
                <Link href="/programme" className="text-text-secondary hover:text-gold transition-colors">
                  Programme
                </Link>
              </li>
              <li>
                <Link href="/editions-precedentes" className="text-text-secondary hover:text-gold transition-colors">
                  Éditions précédentes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-secondary hover:text-gold transition-colors">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Participer */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">Participer</h4>
            <ul className="space-y-2 text-sm">
              {settings.voteActive && (
                <li>
                  <Link href="/voter" className="text-text-secondary hover:text-gold transition-colors">
                    Voter en ligne
                  </Link>
                </li>
              )}
              <li>
                <Link href="/candidatures" className="text-text-secondary hover:text-gold transition-colors">
                  Déposer une candidature
                </Link>
              </li>
              <li>
                <Link href="/billetterie" className="text-text-secondary hover:text-gold transition-colors">
                  Billetterie
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-text-secondary hover:text-gold transition-colors">
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link href="/presse" className="text-text-secondary hover:text-gold transition-colors">
                  Espace presse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span>{settings.address}</span>
              </li>
              {settings.email && (
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors break-all">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>

            <SocialLinks settings={settings} className="mt-6" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} FIF AWARDS — Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-gold transition-colors">
              Mentions légales
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
