'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Info, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HoneypotField } from '@/components/HoneypotField';
import { ticketOrderSchema, type TicketOrderInput } from '@/lib/validations';
import { formatCurrency } from '@/lib/utils';
import type { TicketType } from '@/types/ticket';

interface TicketFormProps {
  tickets: TicketType[];
}

export function TicketForm({ tickets }: TicketFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TicketOrderInput>({
    resolver: zodResolver(ticketOrderSchema),
    defaultValues: { ticketType: 'standard', quantity: 1 },
  });

  const ticketType = watch('ticketType');
  const quantity = watch('quantity');
  const selected = tickets.find((t) => t.id === ticketType);
  const total = (selected?.price ?? 0) * (Number(quantity) || 0);

  async function onSubmit(data: TicketOrderInput) {
    try {
      const res = await fetch('/api/billet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Erreur lors de la réservation.');
        return;
      }
      toast.success('Demande de réservation enregistrée.');
      setSubmitted(true);
    } catch {
      toast.error('Impossible de contacter le serveur.');
    }
  }

  if (submitted) {
    return (
      <div className="card-gold p-10 text-center max-w-md mx-auto">
        <h3 className="font-serif text-2xl text-gold mb-3">Demande enregistrée</h3>
        <p className="text-text-secondary">
          Merci ! Votre réservation est en attente de confirmation. Notre équipe vous recontacte
          pour confirmer vos places et finaliser le paiement.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative card-gold p-6 md:p-8 max-w-2xl mx-auto space-y-5"
    >
      <HoneypotField registration={register('site_web')} />
      <h3 className="font-serif text-2xl text-text-primary mb-2">Réserver mes places</h3>

      <div className="flex gap-3 rounded-md border border-gold/40 bg-gold/5 p-4 text-sm text-text-secondary">
        <Info className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <p>
          <span className="text-text-primary">Pas de paiement en ligne.</span> Votre demande est
          enregistrée puis confirmée manuellement par notre équipe, qui vous recontacte pour le
          règlement (Orange Money, Mobile Money ou virement).
        </p>
      </div>

      <div>
        <Label htmlFor="fullName">Nom complet</Label>
        <Input id="fullName" autoComplete="name" {...register('fullName')} className="mt-1" />
        {errors.fullName && <p className="text-xs text-bordeaux mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            placeholder="+224 ..."
            className="mt-1"
          />
          {errors.phone && <p className="text-xs text-bordeaux mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} className="mt-1" />
          {errors.email && <p className="text-xs text-bordeaux mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <p className="text-xs text-text-secondary -mt-2">Téléphone ou email : au moins l&apos;un des deux.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ticketType">Formule</Label>
          <select
            id="ticketType"
            {...register('ticketType')}
            className="mt-1 w-full h-11 bg-background-secondary border border-border rounded-md px-3 text-text-primary"
          >
            {tickets
              .filter((t) => t.available)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {formatCurrency(t.price, t.currency)}
                </option>
              ))}
          </select>
        </div>
        <div>
          <Label htmlFor="quantity">Nombre de places</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={10}
            {...register('quantity')}
            className="mt-1"
          />
          {errors.quantity && <p className="text-xs text-bordeaux mt-1">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="border-t border-border pt-5 flex items-center justify-between">
        <span className="text-sm uppercase tracking-wider text-text-secondary">Total indicatif</span>
        <span className="font-serif text-2xl text-gold">{formatCurrency(total)}</span>
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Envoyer ma demande'}
      </Button>
    </form>
  );
}
