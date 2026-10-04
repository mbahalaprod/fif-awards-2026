import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s · Admin FIF AWARDS' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background-primary">{children}</div>;
}
