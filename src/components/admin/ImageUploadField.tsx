'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { MEDIA_BUCKET } from '@/lib/supabase/config';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_INPUT_BYTES = 15 * 1024 * 1024; // avant redimensionnement
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024; // limite du bucket

interface ImageUploadFieldProps {
  name: string;
  label: string;
  folder: 'distingues' | 'sponsors' | 'actualites';
  defaultValue?: string | null;
  /** Plus grand côté de l'image après redimensionnement, en pixels. */
  maxSize?: number;
  hint?: string;
}

/** Redimensionne l'image dans le navigateur et la convertit en WebP avant l'envoi. */
async function resizeImage(file: File, maxSize: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Conversion impossible'))),
      'image/webp',
      0.85,
    ),
  );
}

/**
 * Champ photo : envoie le fichier vers Supabase Storage (bucket « medias »)
 * et place l'URL publique dans un champ caché soumis avec le formulaire.
 */
export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue,
  maxSize = 1600,
  hint,
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Format non accepté : utilisez JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      toast.error('Fichier trop lourd (15 Mo maximum).');
      return;
    }

    setUploading(true);
    try {
      const blob = await resizeImage(file, maxSize);
      if (blob.size > MAX_OUTPUT_BYTES) {
        toast.error('Image trop lourde même après réduction (5 Mo maximum).');
        return;
      }
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const supabase = createBrowserSupabase();
      const { error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' });
      if (error) throw error;
      setUrl(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
      toast.success('Image envoyée. Pensez à enregistrer la fiche.');
    } catch (error) {
      console.error(error);
      toast.error("L'envoi de l'image a échoué.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-2 flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative w-32 h-40 rounded-md border border-border bg-background-primary overflow-hidden flex items-center justify-center shrink-0">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-text-secondary" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background-primary/80 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 h-9 px-3 text-xs rounded-md border border-gold text-gold hover:bg-gold hover:text-background-primary cursor-pointer transition-colors">
            <ImagePlus className="h-4 w-4" />
            {url ? "Remplacer l'image" : 'Choisir une image'}
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="sr-only"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          {url && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setUrl('')}>
              <Trash2 className="h-4 w-4" /> Retirer
            </Button>
          )}
          <p className="text-xs text-text-secondary max-w-xs">
            {hint ?? 'JPG, PNG ou WebP. L’image est réduite automatiquement pour le mobile.'}
          </p>
        </div>
      </div>
    </div>
  );
}
