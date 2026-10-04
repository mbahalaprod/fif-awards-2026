'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Award,
  CalendarCheck,
  ExternalLink,
  FileText,
  Handshake,
  Inbox,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Settings,
  UserCog,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import type { AdminRole } from '@/lib/admin/auth';

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/distingues', label: 'Distingués', icon: Award },
  { href: '/admin/categories', label: 'Catégories', icon: ListOrdered },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Handshake },
  { href: '/admin/actualites', label: 'Actualités', icon: FileText },
  { href: '/admin/candidatures', label: 'Candidatures', icon: Inbox },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/reservations', label: 'Réservations', icon: CalendarCheck },
  { href: '/admin/reglages', label: 'Réglages', icon: Settings, adminOnly: true },
  { href: '/admin/comptes', label: 'Comptes', icon: Users, adminOnly: true },
  { href: '/admin/mon-compte', label: 'Mon compte', icon: UserCog },
];

export function AdminNav({ role, email }: { role: AdminRole; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await createBrowserSupabase().auth.signOut();
    router.replace('/admin/connexion');
    router.refresh();
  }

  const visible = links.filter((l) => !l.adminOnly || role === 'admin');

  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar lg:overflow-visible">
      {visible.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors',
              active
                ? 'bg-gold/10 text-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
      <div className="lg:mt-6 lg:pt-6 lg:border-t border-border flex lg:flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm whitespace-nowrap text-text-secondary hover:text-text-primary"
        >
          <ExternalLink className="h-4 w-4" /> Voir le site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm whitespace-nowrap text-text-secondary hover:text-text-primary text-left"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
        <p className="hidden lg:block px-3 pt-4 text-xs text-text-secondary break-all">
          {email}
          <br />
          <span className="text-gold">{role === 'admin' ? 'Administrateur' : 'Éditeur'}</span>
        </p>
      </div>
    </nav>
  );
}
