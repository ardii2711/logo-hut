import { supabase } from '../config/supabase';

export async function uploadFile(
  bucket: string,
  path: string,
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return data.path;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error(`Signed URL error for ${bucket}/${path}:`, error);
    throw new Error(`Signed URL failed: ${error.message}`);
  }

  if (!data?.signedUrl) {
    throw new Error(`Signed URL returned empty for ${path}`);
  }

  return data.signedUrl;
}
