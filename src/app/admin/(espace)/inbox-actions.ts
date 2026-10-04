'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';

const CANDIDATURE_STATUSES = ['nouvelle', 'en_cours', 'retenue', 'refusee'];
const RESERVATION_STATUSES = ['en_attente', 'confirmee', 'annulee'];

export async function setCandidatureStatus(id: string, formData: FormData): Promise<void> {
  await requireStaff();
  const statut = String(formData.get('statut'));
  if (!CANDIDATURE_STATUSES.includes(statut)) return;
  await createSessionClient().from('candidatures').update({ statut }).eq('id', id);
  revalidatePath('/admin/candidatures');
}

export async function setMessageRead(id: string, lu: boolean): Promise<void> {
  await requireStaff();
  await createSessionClient().from('messages').update({ lu }).eq('id', id);
  revalidatePath('/admin/messages');
}

export async function setReservationStatus(id: string, statut: string): Promise<void> {
  await requireStaff();
  if (!RESERVATION_STATUSES.includes(statut)) return;
  await createSessionClient().from('reservations').update({ statut }).eq('id', id);
  revalidatePath('/admin/reservations');
}
