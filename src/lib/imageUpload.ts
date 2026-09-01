import { supabase } from './supabase';

const BUCKET = 'cms-images';

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return urlData.publicUrl;
  } catch {
    return null;
  }
}
