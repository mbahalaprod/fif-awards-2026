'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
      toast.success('Réservation enregistrée. Un email de confirmation vient de partir.');
      setSubmitted(true);
    } catch {
      toast.error('Impossible de contacter le serveur.');
    }
  }

  if (submitted) {
    return (
      <div className="card-gold p-10 text-center max-w-md mx-auto">
        <h3 className="font-serif text-2xl text-gold mb-3">Réservation confirmée</h3>
        <p className="text-text-secondary">
          Merci ! Un email récapitulatif vous a été envoyé. Nous reviendrons vers vous pour finaliser
          le paiement (Orange Money, mobile money ou virement).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-gold p-6 md:p-8 max-w-2xl mx-auto space-y-5">
      <h3 className="font-serif text-2xl text-text-primary mb-2">Réserver mes billets</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" {...register('firstName')} className="mt-1" />
          {errors.firstName && <p className="text-xs text-bordeaux mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" {...register('lastName')} className="mt-1" />
          {errors.lastName && <p className="text-xs text-bordeaux mt-1">{errors.lastName.message}</p>}
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
          <Input id="phone" type="tel" {...register('phone')} placeholder="+224 ..." className="mt-1" />
          {errors.phone && <p className="text-xs text-bordeaux mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="ticketType">Type de billet</Label>
        <select
          id="ticketType"
          {...register('ticketType')}
          className="mt-1 w-full h-11 bg-background-secondary border border-border rounded-md px-3 text-text-primary"
        >
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {formatCurrency(t.price, t.currency)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="quantity">Nombre de billets</Label>
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

      <div className="border-t border-border pt-5 flex items-center justify-between">
        <span className="text-sm uppercase tracking-wider text-text-secondary">Total</span>
        <span className="font-serif text-2xl text-gold">{formatCurrency(total)}</span>
      </div>

      <p className="text-xs text-text-secondary">
        Paiement à finaliser après confirmation par notre équipe. Modes acceptés : Orange Money,
        Mobile Money, virement bancaire.
      </p>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Réserver maintenant'}
      </Button>
    </form>
  );
}
