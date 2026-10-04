import type { SiteSettings } from '@/types/settings';

/** Date du jour à Conakry (UTC+0), au format AAAA-MM-JJ. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Les candidatures sont ouvertes si l'interrupteur est allumé et la date du jour dans la période. */
export function areApplicationsOpen(settings: SiteSettings): boolean {
  if (!settings.applicationsOpen) return false;
  const now = today();
  if (settings.applicationsOpenDate && now < settings.applicationsOpenDate) return false;
  if (settings.applicationsCloseDate && now > settings.applicationsCloseDate) return false;
  return true;
}
