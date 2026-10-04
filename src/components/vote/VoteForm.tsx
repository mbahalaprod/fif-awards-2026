'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Check, Loader2, Mail, Vote as VoteIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category';
import type { Distingue } from '@/types/distingue';

interface VoteFormProps {
  categories: Category[];
  distingues: Distingue[];
  showResults: boolean;
}

type Step = 'select' | 'email' | 'otp' | 'success';

export function VoteForm({ categories, distingues, showResults }: VoteFormProps) {
  const searchParams = useSearchParams();
  const initialCategorySlug = searchParams.get('categorie') ?? '';
  const initialDistingueId = searchParams.get('distingue') ?? '';

  const [categorySlug, setCategorySlug] = useState(initialCategorySlug || categories[0]?.slug || '');
  const [distingueId, setDistingueId] = useState(initialDistingueId);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<Step>('select');
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const selectedCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );
  const categoryDistingues = useMemo(
    () => distingues.filter((d) => d.categoryId === selectedCategory?.id),
    [distingues, selectedCategory],
  );

  // Load vote counts if enabled
  useEffect(() => {
    if (!showResults) return;
    fetch('/api/vote')
      .then((r) => r.json())
      .then((data) => setCounts(data.counts ?? {}))
      .catch(() => {});
  }, [showResults, step]);

  // Reset selection when category changes
  useEffect(() => {
    if (!categoryDistingues.find((d) => d.id === distingueId)) {
      setDistingueId(categoryDistingues[0]?.id ?? '');
    }
  }, [categoryDistingues, distingueId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!distingueId || !selectedCategory) {
      toast.error('Veuillez faire un choix.');
      return;
    }

    if (step === 'select') {
      setStep('email');
      return;
    }

    if (step === 'email') {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        toast.error('Adresse email invalide.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/vote/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Impossible d'envoyer le code.");
          return;
        }
        toast.success(data.message ?? 'Code envoyé.');
        setStep('otp');
      } catch {
        toast.error('Impossible de contacter le serveur.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 'otp') {
      setLoading(true);
      try {
        const res = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            categoryId: selectedCategory.id,
            distingueId,
            code: otp,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? 'Erreur lors du vote.');
          return;
        }
        toast.success(data.message ?? 'Vote enregistré.');
        setStep('success');
      } catch {
        toast.error('Impossible de contacter le serveur.');
      } finally {
        setLoading(false);
      }
    }
  }

  function resetFlow() {
    setStep('select');
    setEmail('');
    setOtp('');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <ol className="flex items-center justify-center gap-3 mb-12 text-xs uppercase tracking-wider text-text-secondary">
        {(['select', 'email', 'otp', 'success'] as const).map((s, idx, arr) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center border',
                step === s || arr.indexOf(step) > idx
                  ? 'bg-gold text-background-primary border-gold'
                  : 'border-border text-text-secondary',
              )}
            >
              {arr.indexOf(step) > idx ? <Check className="h-3 w-3" /> : idx + 1}
            </span>
            <span className="hidden md:inline">
              {s === 'select' ? 'Choix' : s === 'email' ? 'Email' : s === 'otp' ? 'Validation' : 'Confirmé'}
            </span>
            {idx < arr.length - 1 && <span className="w-6 h-px bg-border" />}
          </li>
        ))}
      </ol>

      {step === 'select' && (
        <div className="space-y-8">
          <div>
            <Label className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">
              1. Catégorie
            </Label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full h-12 bg-background-secondary border border-border rounded-md px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <p className="text-sm text-text-secondary mt-2">{selectedCategory.description}</p>
            )}
          </div>

          <div>
            <Label className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">
              2. Votre choix
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryDistingues.map((n) => {
                const isSelected = distingueId === n.id;
                const voteCount = counts[n.id] ?? 0;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setDistingueId(n.id)}
                    className={cn(
                      'card-gold p-4 flex items-center gap-4 text-left transition-all',
                      isSelected ? '!border-gold ring-2 ring-gold/30' : '',
                    )}
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0 bg-background-primary">
                      {n.photoUrl && (
                        <Image src={n.photoUrl} alt={n.name} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-text-primary truncate">{n.name}</p>
                      <p className="text-xs text-text-secondary truncate">{n.metier}</p>
                      {showResults && (
                        <p className="text-[10px] uppercase tracking-wider text-gold mt-1">
                          {voteCount} vote{voteCount > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-gold shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={!distingueId}>
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 'email' && (
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-text-primary mb-2">Validation par email</h3>
            <p className="text-text-secondary text-sm">
              Saisissez votre email pour recevoir un code de validation à usage unique.
            </p>
          </div>
          <div>
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="mt-2"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep('select')}>
              Retour
            </Button>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Recevoir mon code'}
            </Button>
          </div>
        </div>
      )}

      {step === 'otp' && (
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <VoteIcon className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-text-primary mb-2">Code de validation</h3>
            <p className="text-text-secondary text-sm">
              Saisissez le code à 6 chiffres reçu par email.
            </p>
          </div>
          <div>
            <Label htmlFor="otp">Code à 6 chiffres</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="mt-2 text-center text-2xl tracking-[0.5em] font-mono"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep('email')}>
              Retour
            </Button>
            <Button type="submit" size="lg" disabled={loading || otp.length !== 6}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Valider mon vote'}
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="max-w-md mx-auto text-center space-y-6 py-8">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto">
            <Check className="h-10 w-10 text-gold" />
          </div>
          <h3 className="font-serif text-3xl text-text-primary">Merci pour votre vote !</h3>
          <p className="text-text-secondary">
            Votre voix compte. Vous pouvez voter dans une autre catégorie en utilisant le même email.
          </p>
          <Button type="button" onClick={resetFlow} variant="outline" size="lg">
            Voter dans une autre catégorie
          </Button>
        </div>
      )}
    </form>
  );
}
