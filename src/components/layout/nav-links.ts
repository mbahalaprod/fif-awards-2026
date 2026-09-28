export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/nomines', label: 'Nominés' },
  { href: '/voter', label: 'Voter' },
  { href: '/candidatures', label: 'Candidatures' },
  { href: '/programme', label: 'Programme' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/billetterie', label: 'Billetterie' },
  { href: '/editions-precedentes', label: 'Éditions' },
  { href: '/presse', label: 'Presse' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];
