'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled || isOpen
          ? 'bg-background-primary/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-xl md:text-2xl text-gold tracking-tight">
            FIF<span className="text-text-primary"> AWARDS</span>
          </span>
          <span className="hidden md:inline-block text-xs uppercase tracking-[0.2em] text-text-secondary ml-2 border-l border-border pl-2">
            2026
          </span>
        </Link>

        {/* Desktop nav (compact, only main links) */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.slice(0, 7).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm uppercase tracking-wider transition-colors',
                  isActive ? 'text-gold' : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link href="/voter" className="hidden md:inline-flex btn-gold !px-6 !py-3 !text-xs">
            Voter
          </Link>
          <button
            type="button"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden text-text-primary p-2 -mr-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-background-primary border-t border-border overflow-hidden"
          >
            <ul className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block py-3 text-base uppercase tracking-wider border-b border-border/50 transition-colors',
                        isActive ? 'text-gold' : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-6">
                <Link href="/voter" className="btn-gold w-full">
                  Voter maintenant
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
