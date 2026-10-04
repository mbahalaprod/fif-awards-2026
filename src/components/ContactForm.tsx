'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { HoneypotField } from '@/components/HoneypotField';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Erreur lors de l\'envoi.');
        return;
      }
      toast.success('Message envoyé. Nous reviendrons vers vous rapidement.');
      setSubmitted(true);
    } catch {
      toast.error('Impossible de contacter le serveur.');
    }
  }

  if (submitted) {
    return (
      <div className="card-gold p-10 text-center">
        <h3 className="font-serif text-2xl text-gold mb-3">Message envoyé</h3>
        <p className="text-text-secondary">Merci ! Notre équipe vous répondra dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative card-gold p-6 md:p-8 space-y-5">
      <HoneypotField registration={register('site_web')} />
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" {...register('name')} className="mt-1" />
        {errors.name && <p className="text-xs text-bordeaux mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} className="mt-1" />
        {errors.email && <p className="text-xs text-bordeaux mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="subject">Sujet</Label>
        <select
          id="subject"
          {...register('subject')}
          className="mt-1 w-full h-11 bg-background-secondary border border-border rounded-md px-3 text-text-primary"
        >
          <option value="">— Choisir un sujet —</option>
          <option value="candidature">Candidature</option>
          <option value="partenariat">Partenariat / Sponsoring</option>
          <option value="presse">Presse / Médias</option>
          <option value="information">Information générale</option>
        </select>
        {errors.subject && <p className="text-xs text-bordeaux mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} {...register('message')} className="mt-1" />
        {errors.message && <p className="text-xs text-bordeaux mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Envoyer le message'}
      </Button>
    </form>
  );
}
