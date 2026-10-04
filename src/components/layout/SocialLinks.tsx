import { Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2 } from 'lucide-react';
import type { SiteSettings } from '@/types/settings';
import { cn } from '@/lib/utils';

/** Liens vers les réseaux sociaux renseignés dans les réglages (rien si aucun). */
export function SocialLinks({
  settings,
  className,
  size = 'sm',
}: {
  settings: SiteSettings;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const whatsappDigits = settings.whatsapp?.replace(/\D/g, '');
  const links = [
    { href: settings.facebookUrl, label: 'Facebook', icon: Facebook },
    { href: settings.instagramUrl, label: 'Instagram', icon: Instagram },
    { href: settings.youtubeUrl, label: 'YouTube', icon: Youtube },
    { href: settings.tiktokUrl, label: 'TikTok', icon: Music2 },
    { href: settings.linkedinUrl, label: 'LinkedIn', icon: Linkedin },
    { href: whatsappDigits ? `https://wa.me/${whatsappDigits}` : null, label: 'WhatsApp', icon: MessageCircle },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            'rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors',
            size === 'md' ? 'w-10 h-10' : 'w-9 h-9',
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
