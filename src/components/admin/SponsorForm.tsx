'use client';

import Link from 'next/link';
import { ActionForm, SubmitButton } from './ActionForm';
import { ImageUploadField } from './ImageUploadField';
import { STATUS_OPTIONS, SelectField, TIER_OPTIONS, TextAreaField, TextField } from './fields';
import type { FormAction } from '@/lib/admin/action-state';

export interface SponsorFormValues {
  nom: string;
  palier: string;
  description: string | null;
  logo_url: string | null;
  site_url: string | null;
  statut: string;
  ordre: number;
}

export function SponsorForm({ action, sponsor }: { action: FormAction; sponsor?: SponsorFormValues }) {
  return (
    <ActionForm action={action} className="card-gold p-6 md:p-8 space-y-5 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField name="nom" label="Nom" required defaultValue={sponsor?.nom} />
        <SelectField
          name="palier"
          label="Palier"
          defaultValue={sponsor?.palier ?? 'or'}
          options={TIER_OPTIONS}
        />
      </div>
      <TextField
        name="site_url"
        label="Site web (facultatif)"
        type="url"
        placeholder="https://"
        defaultValue={sponsor?.site_url ?? ''}
      />
      <TextAreaField
        name="description"
        label="Description courte (facultatif)"
        rows={3}
        defaultValue={sponsor?.description ?? ''}
      />
      <ImageUploadField
        name="logo_url"
        label="Logo"
        folder="sponsors"
        maxSize={800}
        defaultValue={sponsor?.logo_url}
        hint="PNG sur fond transparent de préférence."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SelectField
          name="statut"
          label="Statut"
          defaultValue={sponsor?.statut ?? 'brouillon'}
          options={STATUS_OPTIONS}
        />
        <TextField name="ordre" label="Ordre d'affichage" type="number" defaultValue={sponsor?.ordre ?? 0} />
      </div>
      <div className="flex gap-3 pt-4 border-t border-border">
        <SubmitButton>Enregistrer</SubmitButton>
        <Link
          href="/admin/sponsors"
          className="inline-flex items-center h-11 px-6 rounded-md text-sm text-text-secondary hover:text-text-primary"
        >
          Retour à la liste
        </Link>
      </div>
    </ActionForm>
  );
}
