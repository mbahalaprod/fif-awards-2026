import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/admin/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Connexion' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getStaff()) redirect('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Image
          src="/logo-fond-sombre.png"
          alt="FIF Awards"
          width={240}
          height={120}
          priority
          className="mx-auto h-24 w-auto mb-8"
        />
        <div className="card-gold p-6 md:p-8">
          <h1 className="font-serif text-2xl text-text-primary mb-1">Espace d&apos;administration</h1>
          <p className="text-sm text-text-secondary mb-6">Réservé au Comité d&apos;Organisation.</p>
          {isSupabaseConfigured() ? (
            <LoginForm />
          ) : (
            <p className="text-sm text-bordeaux">
              Supabase n&apos;est pas encore configuré : renseignez les variables
              d&apos;environnement (voir docs/SUPABASE.md).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
