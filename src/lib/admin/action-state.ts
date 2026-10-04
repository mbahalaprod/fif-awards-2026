/** Résultat renvoyé par les actions serveur de l'admin (affiché en notification). */
export interface ActionState {
  ok: boolean;
  message: string;
}

export const initialActionState: ActionState = { ok: true, message: '' };

export type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;
