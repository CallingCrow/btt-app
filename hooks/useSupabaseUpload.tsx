import { useState, ChangeEvent } from "react";
import { supabase } from "@/app/supabase-client";

export const useSupabaseUpload = (bucket: string) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;

    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  return {
    file,
    setFile,
    handleFileChange,
    uploadImage,
  };
};