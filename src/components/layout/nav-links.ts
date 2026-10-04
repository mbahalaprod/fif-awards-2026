export interface NavLink {
  href: string;
  label: string;
  /** Lien affiché seulement quand le vote du public est actif. */
  requiresVote?: boolean;
}

const allNavLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/distingues', label: 'Distingués' },
  { href: '/voter', label: 'Voter', requiresVote: true },
  { href: '/candidatures', label: 'Candidatures' },
  { href: '/programme', label: 'Programme' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/billetterie', label: 'Billetterie' },
  { href: '/editions-precedentes', label: 'Éditions' },
  { href: '/presse', label: 'Presse' },
  { href: '/blog', label: 'Actualités' },
  { href: '/contact', label: 'Contact' },
];

export function getNavLinks(voteActive: boolean): NavLink[] {
  return allNavLinks.filter((link) => voteActive || !link.requiresVote);
}
