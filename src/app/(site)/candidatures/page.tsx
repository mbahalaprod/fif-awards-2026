import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Lock } from 'lucide-react';
import { CandidatureMultiStepForm } from '@/components/candidature/CandidatureMultiStepForm';
import { DocumentLink } from '@/components/DocumentLink';
import { getCategories, getSettings } from '@/lib/data';
import { areApplicationsOpen } from '@/lib/settings';
import { DOCUMENTS } from '@/lib/documents';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Déposer une candidature',
  description:
    "Professionnels, institutions et médias du cinéma : déposez votre candidature pour l'une des quatre distinctions d'honneur du FIF AWARDS 2026.",
};

export default async function CandidaturesPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const open = areApplicationsOpen(settings);

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Appel à candidatures 2026</p>
          <h1 className="section-title mb-6">Déposer une candidature</h1>
          <p className="text-text-secondary text-lg mb-6">
            Le FIF AWARDS 2026 distingue celles et ceux qui font vivre le cinéma, dans quatre
            distinctions d&apos;honneur. Les distingués sont choisis par le Comité
            d&apos;Organisation.
          </p>
          {settings.applicationsCloseDate && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bordeaux/20 border border-bordeaux text-text-primary text-sm">
              <Calendar className="h-4 w-4 text-gold" />
              Date limite : {formatDate(settings.applicationsCloseDate)}
            </div>
          )}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <DocumentLink href={DOCUMENTS.reglement} label="Règlement" />
            <DocumentLink href={DOCUMENTS.dossierCandidature} label="Dossier de candidature" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-16">
          {categories.map((c) => (
            <div
              key={c.id}
              className="card-gold p-4 text-center text-xs uppercase tracking-wider text-text-secondary flex items-center justify-center"
            >
              {c.name}
            </div>
          ))}
        </div>

        {open ? (
          <CandidatureMultiStepForm categories={categories} />
        ) : (
          <div className="card-gold p-10 text-center max-w-lg mx-auto">
            <Lock className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-text-primary mb-3">Candidatures fermées</h2>
            <p className="text-text-secondary mb-6">
              {settings.applicationsOpenDate && new Date().toISOString().slice(0, 10) < settings.applicationsOpenDate
                ? `L'appel à candidatures ouvrira le ${formatDate(settings.applicationsOpenDate)}.`
                : "L'appel à candidatures n'est pas ouvert pour le moment."}
            </p>
            <Link href="/contact" className="btn-outline-gold">
              Nous contacter
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
