import type { UseFormRegisterReturn } from 'react-hook-form';

/**
 * Champ piège anti-robot : invisible et ignoré par les lecteurs d'écran.
 * Un humain le laisse vide ; un robot qui remplit tous les champs se trahit.
 */
export function HoneypotField({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
      <label>
        Site web (laisser vide)
        <input type="text" tabIndex={-1} autoComplete="off" {...registration} />
      </label>
    </div>
  );
}
