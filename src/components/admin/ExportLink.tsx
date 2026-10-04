import { Download } from 'lucide-react';

export function ExportLink({ table }: { table: 'candidatures' | 'messages' | 'reservations' }) {
  return (
    <a
      href={`/admin/export/${table}`}
      className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm border border-gold text-gold hover:bg-gold hover:text-background-primary"
    >
      <Download className="h-4 w-4" /> Exporter en CSV
    </a>
  );
}
