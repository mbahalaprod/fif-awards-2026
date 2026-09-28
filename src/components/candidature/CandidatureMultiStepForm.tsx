'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { candidatureSchema, type CandidatureInput } from '@/lib/validations';
import type { Category } from '@/types/category';

interface Props {
  categories: Category[];
}

const STEPS = [
  { id: 1, label: 'Identité' },
  { id: 2, label: 'Type' },
  { id: 3, label: 'Œuvre' },
  { id: 4, label: 'Médias' },
  { id: 5, label: 'Récap' },
];

type StepFields = Record<number, (keyof CandidatureInput)[]>;

const stepFields: StepFields = {
  1: ['firstName', 'lastName', 'email', 'phone', 'country'],
  2: ['applicationType', 'categoryId'],
  3: ['workTitle', 'workYear', 'duration', 'synopsis', 'team'],
  4: ['posterUrl', 'trailerUrl'],
  5: ['consent'],
};

export function CandidatureMultiStepForm({ categories }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CandidatureInput>({
    resolver: zodResolver(candidatureSchema),
    mode: 'onBlur',
    defaultValues: {
      country: 'Guinée',
      workYear: 2025,
      duration: 90,
    },
  });

  const { register, handleSubmit, formState, trigger, watch, getValues } = form;
  const errors = formState.errors;

  async function nextStep() {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, 5));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit(data: CandidatureInput) {
    try {
      const res = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Erreur lors du dépôt.');
        return;
      }
      toast.success('Candidature envoyée. Un email de confirmation vient de partir.');
      setSubmitted(true);
    } catch {
      toast.error('Impossible de contacter le serveur.');
    }
  }

  if (submitted) {
    return (
      <div className="card-gold p-10 text-center max-w-lg mx-auto">
        <Check className="h-12 w-12 text-gold mx-auto mb-4" />
        <h3 className="font-serif text-2xl text-text-primary mb-3">Candidature reçue</h3>
        <p className="text-text-secondary">
          Merci pour votre candidature. Notre équipe l&apos;examinera et reviendra vers vous par
          email dans les meilleurs délais.
        </p>
      </div>
    );
  }

  const values = getValues();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <ol className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {STEPS.map((s, idx) => (
          <li key={s.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-2 flex-1">
              <span
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm border',
                  step >= s.id
                    ? 'bg-gold text-background-primary border-gold'
                    : 'border-border text-text-secondary',
                )}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-secondary hidden md:inline">
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && <span className="h-px bg-border w-full -mt-5" />}
          </li>
        ))}
      </ol>

      <div className="card-gold p-6 md:p-8 space-y-5">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Votre identité</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register('firstName')} className="mt-1" />
                {errors.firstName && (
                  <p className="text-xs text-bordeaux mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register('lastName')} className="mt-1" />
                {errors.lastName && (
                  <p className="text-xs text-bordeaux mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} className="mt-1" />
                {errors.email && <p className="text-xs text-bordeaux mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" {...register('phone')} className="mt-1" />
                {errors.phone && <p className="text-xs text-bordeaux mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Pays</Label>
              <Input id="country" {...register('country')} className="mt-1" />
              {errors.country && <p className="text-xs text-bordeaux mt-1">{errors.country.message}</p>}
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Type de candidature</h2>
            <div>
              <Label>Vous candidatez en tant que...</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {[
                  { value: 'film', label: 'Long-métrage' },
                  { value: 'serie', label: 'Série' },
                  { value: 'technique', label: 'Métier technique' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="card-gold p-4 cursor-pointer flex items-center gap-3 has-[:checked]:!border-gold has-[:checked]:ring-2 has-[:checked]:ring-gold/30"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('applicationType')}
                      className="accent-gold"
                    />
                    <span className="text-text-primary">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.applicationType && (
                <p className="text-xs text-bordeaux mt-1">{errors.applicationType.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="categoryId">Catégorie visée</Label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="mt-1 w-full h-11 bg-background-secondary border border-border rounded-md px-3 text-text-primary"
              >
                <option value="">— Choisir une catégorie —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-bordeaux mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Détails de l&apos;œuvre</h2>
            <div>
              <Label htmlFor="workTitle">Titre de l&apos;œuvre</Label>
              <Input id="workTitle" {...register('workTitle')} className="mt-1" />
              {errors.workTitle && (
                <p className="text-xs text-bordeaux mt-1">{errors.workTitle.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workYear">Année de production</Label>
                <Input id="workYear" type="number" {...register('workYear')} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input id="duration" type="number" {...register('duration')} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="synopsis">Synopsis</Label>
              <Textarea id="synopsis" rows={5} {...register('synopsis')} className="mt-1" />
              {errors.synopsis && (
                <p className="text-xs text-bordeaux mt-1">{errors.synopsis.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="team">Équipe principale (réalisation, production, comédien·ne·s)</Label>
              <Textarea id="team" rows={3} {...register('team')} className="mt-1" />
              {errors.team && <p className="text-xs text-bordeaux mt-1">{errors.team.message}</p>}
            </div>
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Médias</h2>
            <p className="text-sm text-text-secondary mb-4">
              Pour cette V1, merci de fournir des liens (YouTube, Vimeo, Drive) plutôt qu&apos;un
              upload direct. L&apos;upload sera disponible en V2.
            </p>
            <div>
              <Label htmlFor="posterUrl">Lien vers l&apos;affiche (optionnel)</Label>
              <Input
                id="posterUrl"
                type="url"
                placeholder="https://..."
                {...register('posterUrl')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="trailerUrl">Lien YouTube/Vimeo de la bande-annonce</Label>
              <Input
                id="trailerUrl"
                type="url"
                placeholder="https://youtube.com/..."
                {...register('trailerUrl')}
                className="mt-1"
              />
              {errors.trailerUrl && (
                <p className="text-xs text-bordeaux mt-1">{errors.trailerUrl.message}</p>
              )}
            </div>
          </>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-4">Récapitulatif</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 pb-2 border-b border-border">
                <dt className="text-text-secondary">Candidat·e</dt>
                <dd className="text-text-primary text-right">
                  {values.firstName} {values.lastName}
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2 border-b border-border">
                <dt className="text-text-secondary">Email</dt>
                <dd className="text-text-primary text-right">{values.email}</dd>
              </div>
              <div className="flex justify-between gap-4 pb-2 border-b border-border">
                <dt className="text-text-secondary">Œuvre</dt>
                <dd className="text-text-primary text-right">
                  {values.workTitle} ({values.workYear})
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2 border-b border-border">
                <dt className="text-text-secondary">Catégorie</dt>
                <dd className="text-text-primary text-right">
                  {categories.find((c) => c.id === values.categoryId)?.name ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2 border-b border-border">
                <dt className="text-text-secondary">Bande-annonce</dt>
                <dd className="text-gold text-right text-xs break-all">{values.trailerUrl}</dd>
              </div>
            </dl>
            <label className="flex items-start gap-3 mt-6 cursor-pointer">
              <input type="checkbox" {...register('consent')} className="accent-gold mt-1" />
              <span className="text-sm text-text-secondary">
                Je certifie l&apos;exactitude des informations fournies et j&apos;accepte le
                règlement du FIF AWARDS 2026.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-bordeaux">{errors.consent.message}</p>}
          </>
        )}

        {/* Nav */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1}
          >
            Précédent
          </Button>
          {step < 5 ? (
            <Button type="button" onClick={nextStep}>
              Suivant
            </Button>
          ) : (
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Envoyer ma candidature'
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
