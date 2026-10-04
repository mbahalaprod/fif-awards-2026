'use client';

import Link from 'next/link';
import { ActionForm, SubmitButton } from './ActionForm';
import { ImageUploadField } from './ImageUploadField';
import { STATUS_OPTIONS, SelectField, TextAreaField, TextField } from './fields';
import type { FormAction } from '@/lib/admin/action-state';

export interface ActualiteFormValues {
  titre: string;
  date_publication: string;
  texte: string;
  image_url: string | null;
  statut: string;
}

export function ActualiteForm({
  action,
  actualite,
}: {
  action: FormAction;
  actualite?: ActualiteFormValues;
}) {
  return (
    <ActionForm action={action} className="card-gold p-6 md:p-8 space-y-5 max-w-3xl">
      <TextField name="titre" label="Titre" required defaultValue={actualite?.titre} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField
          name="date_publication"
          label="Date"
          type="date"
          required
          defaultValue={actualite?.date_publication ?? new Date().toISOString().slice(0, 10)}
        />
        <SelectField
          name="statut"
          label="Statut"
          defaultValue={actualite?.statut ?? 'brouillon'}
          options={STATUS_OPTIONS}
        />
      </div>
      <TextAreaField
        name="texte"
        label="Texte"
        rows={12}
        required
        hint="Laissez une ligne vide entre deux paragraphes. Le premier paragraphe sert de résumé."
        defaultValue={actualite?.texte}
      />
      <ImageUploadField
        name="image_url"
        label="Image (facultatif)"
        folder="actualites"
        defaultValue={actualite?.image_url}
        hint="Format paysage de préférence (16:9)."
      />
      <div className="flex gap-3 pt-4 border-t border-border">
        <SubmitButton>Enregistrer</SubmitButton>
        <Link
          href="/admin/actualites"
          className="inline-flex items-center h-11 px-6 rounded-md text-sm text-text-secondary hover:text-text-primary"
        >
          Retour à la liste
        </Link>
      </div>
    </ActionForm>
  );
}
