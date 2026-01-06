import { BUKET_NAME } from "@/lib/constants";
import supabase from "@/lib/supabase";

export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUKET_NAME)
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImages(filePath: string[]) {
  const { data, error } = await supabase.storage
    .from(BUKET_NAME)
    .remove(filePath);

  if (error) throw error;
  return data;
}

export async function deleteImagesInPath(path: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUKET_NAME)
    .list(path);

  if (fetchFilesError) throw fetchFilesError;

  const { error: removeError } = await supabase.storage
    .from(BUKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}
