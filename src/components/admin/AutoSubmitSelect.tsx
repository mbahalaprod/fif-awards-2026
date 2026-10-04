'use client';

import { cn } from '@/lib/utils';
import { selectClassName } from './fields';

/** Liste déroulante qui enregistre dès qu'on change la valeur. */
export function AutoSubmitSelect({
  name,
  defaultValue,
  options,
  label,
}: {
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      name={name}
      aria-label={label}
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={cn(selectClassName, 'h-9 text-sm w-auto')}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
