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
import { HoneypotField } from '@/components/HoneypotField';
import { cn } from '@/lib/utils';
import { candidatureSchema, type CandidatureInput } from '@/lib/validations';
import type { Category } from '@/types/category';

interface Props {
  categories: Category[];
}

const STEPS = [
  { id: 1, label: 'Identité' },
  { id: 2, label: 'Candidature' },
  { id: 3, label: 'Envoi' },
];

const stepFields: Record<number, (keyof CandidatureInput)[]> = {
  1: ['fullName', 'email', 'phone'],
  2: ['categoryId', 'workOrCareer', 'link'],
  3: ['message', 'consent'],
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-bordeaux mt-1">{message}</p> : null;
}

export function CandidatureMultiStepForm({ categories }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState, trigger, getValues } = useForm<CandidatureInput>({
    resolver: zodResolver(candidatureSchema),
    mode: 'onBlur',
  });
  const errors = formState.errors;

  async function nextStep() {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
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
      toast.success('Candidature envoyée.');
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
          Merci pour votre candidature. Le Comité d&apos;Organisation l&apos;examinera et
          reviendra vers vous.
        </p>
      </div>
    );
  }

  const values = getValues();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative max-w-3xl mx-auto">
      <HoneypotField registration={register('site_web')} />

      <ol className="flex items-center justify-between mb-12 max-w-md mx-auto">
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
              <span className="text-[10px] uppercase tracking-wider text-text-secondary">
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && <span className="h-px bg-border w-full -mt-5" />}
          </li>
        ))}
      </ol>

      <div className="card-gold p-6 md:p-8 space-y-5">
        {step === 1 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Votre identité</h2>
            <div>
              <Label htmlFor="fullName">Nom complet (ou nom de la structure)</Label>
              <Input id="fullName" autoComplete="name" {...register('fullName')} className="mt-1" />
              <FieldError message={errors.fullName?.message} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register('email')} className="mt-1" />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+224 ..."
                  {...register('phone')}
                  className="mt-1"
                />
                <FieldError message={errors.phone?.message} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Votre candidature</h2>
            <div>
              <Label htmlFor="categoryId">Distinction visée</Label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="mt-1 w-full h-11 bg-background-secondary border border-border rounded-md px-3 text-text-primary"
              >
                <option value="">— Choisir une distinction —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.categoryId?.message} />
            </div>
            <div>
              <Label htmlFor="workOrCareer">Œuvre ou parcours</Label>
              <Textarea
                id="workOrCareer"
                rows={6}
                placeholder="Présentez l'œuvre, le métier exercé ou le parcours que vous souhaitez faire valoir."
                {...register('workOrCareer')}
                className="mt-1"
              />
              <FieldError message={errors.workOrCareer?.message} />
            </div>
            <div>
              <Label htmlFor="link">Lien vers vos travaux (YouTube, Vimeo ou Google Drive) — facultatif</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://..."
                {...register('link')}
                className="mt-1"
              />
              <FieldError message={errors.link?.message} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-serif text-2xl text-text-primary mb-2">Dernière étape</h2>
            <div>
              <Label htmlFor="message">Message au comité (facultatif)</Label>
              <Textarea id="message" rows={4} {...register('message')} className="mt-1" />
              <FieldError message={errors.message?.message} />
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ['Candidat·e', values.fullName],
                ['Email', values.email],
                ['Téléphone', values.phone],
                ['Distinction', categories.find((c) => c.id === values.categoryId)?.name ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 pb-2 border-b border-border">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="text-text-primary text-right break-all">{value}</dd>
                </div>
              ))}
            </dl>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" {...register('consent')} className="accent-gold mt-1" />
              <span className="text-sm text-text-secondary">
                Je certifie l&apos;exactitude des informations fournies et j&apos;accepte le
                règlement du FIF AWARDS 2026.
              </span>
            </label>
            <FieldError message={errors.consent?.message} />
          </>
        )}

        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1}
          >
            Précédent
          </Button>
          {step < STEPS.length ? (
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
