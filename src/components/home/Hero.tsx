'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[100vh] min-h-[640px] flex items-center justify-center overflow-hidden -mt-20">
      {/* Background image (cinematic) */}
      <Image
        src="https://images.unsplash.com/photo-1518676590629-3dcba9c5a555?w=2400&q=85"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-background-primary/60" aria-hidden="true" />
      <div className="absolute inset-0 overlay-dark" aria-hidden="true" />

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-gold mb-6">
            4ᵉ édition · 19 — 20 novembre 2026 · Conakry
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-text-primary mb-6 text-balance leading-[1.05]"
        >
          FIF <span className="text-gold">AWARDS</span>
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl text-text-primary/90 italic">
            Festival International de Film
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="font-sans text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Célébrer le cinéma guinéen et toute sa chaîne de valeur — des acteurs aux ingénieurs du
          son, des scénaristes aux directrices de la photographie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/voter" className="btn-gold w-full sm:w-auto">
            Voter maintenant <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/billetterie" className="btn-outline-gold w-full sm:w-auto">
            <Ticket className="h-4 w-4" /> Acheter un billet
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-secondary text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2"
      >
        <span>Scroller</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gold/50"
        />
      </motion.div>
    </section>
  );
}
