import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, ImageIcon, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Espace presse & médias',
  description: 'Kit médias, dossier de partenariat et communiqués de presse du FIF AWARDS 2026.',
};

export default function PressePage() {
  return (
    <section className="section">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <p className="section-subtitle">Espace dédié</p>
          <h1 className="section-title mb-6">Presse & médias</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Tous les documents officiels du FIF AWARDS 2026, en libre accès pour les journalistes,
            créateurs de contenu et partenaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="card-gold p-8">
            <FileText className="h-8 w-8 text-gold mb-4" />
            <h2 className="font-serif text-2xl text-text-primary mb-3">Dossier de partenariat</h2>
            <p className="text-text-secondary text-sm mb-6">
              Présentation complète du festival, des 4 paliers de sponsoring et des contreparties
              associées.
            </p>
            <a href="/dossier-partenariat.pdf" className="btn-outline-gold">
              <Download className="h-4 w-4" /> Télécharger (PDF)
            </a>
          </div>

          <div className="card-gold p-8">
            <ImageIcon className="h-8 w-8 text-gold mb-4" />
            <h2 className="font-serif text-2xl text-text-primary mb-3">Kit médias</h2>
            <p className="text-text-secondary text-sm mb-6">
              Logos HD, charte graphique, photos officielles et visuels prêts à l&apos;emploi pour
              vos publications.
            </p>
            <a href="/kit-medias.zip" className="btn-outline-gold">
              <Download className="h-4 w-4" /> Télécharger (ZIP)
            </a>
          </div>
        </div>

        <div className="card-gold p-8 md:p-12 text-center">
          <Mail className="h-8 w-8 text-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-text-primary mb-3">Contact presse</h2>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            Pour toute demande d&apos;interview, accréditation, ou information complémentaire, notre
            équipe presse vous répond sous 24h ouvrées.
          </p>
          <Link href="/contact" className="btn-gold">
            Contacter la presse
          </Link>
        </div>
      </div>
    </section>
  );
}
