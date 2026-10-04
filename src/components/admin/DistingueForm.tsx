'use client';

import Link from 'next/link';
import { ActionForm, SubmitButton } from './ActionForm';
import { ImageUploadField } from './ImageUploadField';
import { STATUS_OPTIONS, SelectField, TextAreaField, TextField } from './fields';
import type { FormAction } from '@/lib/admin/action-state';
import type { Category } from '@/types/category';
import type { Distingue } from '@/types/distingue';

export function DistingueForm({
  action,
  categories,
  distingue,
}: {
  action: FormAction;
  categories: Category[];
  distingue?: Distingue;
}) {
  return (
    <ActionForm action={action} className="card-gold p-6 md:p-8 space-y-5 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField name="nom_complet" label="Nom complet" required defaultValue={distingue?.name} />
        <TextField
          name="metier"
          label="Métier"
          placeholder="Ex. : Monteur, Réalisatrice…"
          defaultValue={distingue?.metier ?? ''}
        />
      </div>
      <SelectField
        name="categorie_id"
        label="Catégorie"
        required
        defaultValue={distingue?.categoryId ?? ''}
        options={[
          { value: '', label: '— Choisir une catégorie —' },
          ...categories.map((c) => ({ value: c.id, label: c.name })),
        ]}
      />
      <TextAreaField
        name="citation"
        label="Citation courte"
        rows={2}
        maxLength={300}
        defaultValue={distingue?.citation ?? ''}
      />
      <TextAreaField
        name="biographie"
        label="Parcours (facultatif)"
        rows={5}
        hint="Laissez une ligne vide entre deux paragraphes."
        defaultValue={distingue?.biography ?? ''}
      />
      <ImageUploadField
        name="photo_url"
        label="Photo"
        folder="distingues"
        defaultValue={distingue?.photoUrl}
        hint="Portrait vertical, au moins 800 × 1000 px. Accord de la personne requis avant publication."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SelectField
          name="statut"
          label="Statut"
          defaultValue={distingue?.status ?? 'brouillon'}
          options={STATUS_OPTIONS}
        />
        <TextField
          name="ordre"
          label="Ordre d'affichage"
          type="number"
          defaultValue={distingue?.order ?? 0}
          hint="Les plus petits nombres s'affichent en premier."
        />
      </div>
      <div className="flex gap-3 pt-4 border-t border-border">
        <SubmitButton>Enregistrer</SubmitButton>
        <Link
          href="/admin/distingues"
          className="inline-flex items-center h-11 px-6 rounded-md text-sm text-text-secondary hover:text-text-primary"
        >
          Retour à la liste
        </Link>
      </div>
    </ActionForm>
  );
}
