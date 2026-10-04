import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const selectClassName =
  'w-full h-11 bg-background-secondary border border-border rounded-md px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-gold';

interface BaseFieldProps {
  name: string;
  label: string;
  hint?: string;
  className?: string;
}

export function TextField({
  name,
  label,
  hint,
  className,
  ...props
}: BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="mt-1" {...props} />
      {hint && <p className="text-xs text-text-secondary mt-1">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  className,
  ...props
}: BaseFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} className="mt-1" {...props} />
      {hint && <p className="text-xs text-text-secondary mt-1">{hint}</p>}
    </div>
  );
}

export function SelectField({
  name,
  label,
  hint,
  className,
  options,
  ...props
}: BaseFieldProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} className={cn(selectClassName, 'mt-1')} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-text-secondary mt-1">{hint}</p>}
    </div>
  );
}

export function SwitchField({
  name,
  label,
  hint,
  defaultChecked,
}: BaseFieldProps & { defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer card-gold p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="accent-gold mt-1 h-4 w-4 shrink-0"
      />
      <span>
        <span className="block text-text-primary">{label}</span>
        {hint && <span className="block text-xs text-text-secondary mt-1">{hint}</span>}
      </span>
    </label>
  );
}

export const STATUS_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon (invisible sur le site)' },
  { value: 'publie', label: 'Publié' },
];

export const TIER_OPTIONS = [
  { value: 'platine', label: 'Platine' },
  { value: 'or', label: 'Or' },
  { value: 'argent', label: 'Argent' },
  { value: 'bronze', label: 'Bronze' },
];
