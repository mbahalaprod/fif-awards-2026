import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-2xl text-gold tracking-tight">
              FIF<span className="text-text-primary"> AWARDS</span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Festival International de Film AWARDS. 4ᵉ édition les 19 et 20 novembre 2026 à Conakry,
              au Radisson Blu.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
              Célébrer toute la chaîne de valeur du cinéma guinéen
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
                <Link href="/nomines" className="text-text-secondary hover:text-gold transition-colors">
                  Les nominés
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
              <li>
                <Link href="/voter" className="text-text-secondary hover:text-gold transition-colors">
                  Voter en ligne
                </Link>
              </li>
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
                <span>Radisson Blu Hôtel, Conakry, Guinée</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <a href="mailto:contact@fifawards.gn" className="hover:text-gold transition-colors">
                  contact@fifawards.gn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <a href="tel:+224000000000" className="hover:text-gold transition-colors">
                  +224 000 000 000
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
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
