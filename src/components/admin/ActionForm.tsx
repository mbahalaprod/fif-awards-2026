'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { initialActionState, type FormAction } from '@/lib/admin/action-state';

interface ActionFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'action'> {
  action: FormAction;
  /** Vide le formulaire après un succès (formulaires d'ajout). */
  resetOnSuccess?: boolean;
}

/** Formulaire branché sur une action serveur, avec notification du résultat. */
export function ActionForm({ action, resetOnSuccess, children, ...props }: ActionFormProps) {
  const [state, formAction] = useFormState(action, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      if (resetOnSuccess) formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state, resetOnSuccess]);

  return (
    <form ref={formRef} action={formAction} {...props}>
      {children}
    </form>
  );
}

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}

/** Bouton qui demande confirmation avant d'envoyer (suppressions). */
export function ConfirmSubmitButton({
  confirmMessage,
  children,
  ...props
}: ButtonProps & { confirmMessage: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      {...props}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}
