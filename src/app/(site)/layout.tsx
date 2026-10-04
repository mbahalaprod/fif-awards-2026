import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSettings } from '@/lib/data';

// Les contenus viennent de Supabase : les pages sont régénérées au plus toutes les 60 s.
// L'espace d'administration force aussi la mise à jour après chaque modification.
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header voteActive={settings.voteActive} />
      <main className="pt-20">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
