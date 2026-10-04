import Image from 'next/image';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/auth';
import { AdminNav } from '@/components/admin/AdminNav';

// Toujours rendu à la demande : données privées, jamais mises en cache.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();

  return (
    <div className="lg:flex min-h-screen">
      <aside className="lg:w-60 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-background-secondary/40 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Link href="/admin" className="block mb-4 lg:mb-8">
          <Image src="/logo-fond-sombre.png" alt="FIF Awards" width={140} height={70} className="h-12 w-auto" />
        </Link>
        <AdminNav role={staff.role} email={staff.email} />
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
