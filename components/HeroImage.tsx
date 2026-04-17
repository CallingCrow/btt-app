"use client";

import { heroImage } from "@/types/images";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase-client";
import Image from "next/image";
import backupImg from "@/public/Backup.jpg";

interface heroImageProps {
  page: string;
}

export default function HeroImage({ page }: heroImageProps) {
  const [heroImage, setHeroImage] = useState<heroImage | null>(null);
  const fetchHeroImage = async () => {
    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .eq("page", page)
      .maybeSingle();

    if (error) {
      console.error("Error fetching hero image on home page", error.message);
      return;
    }

    setHeroImage(data);
  };

  useEffect(() => {
    fetchHeroImage();
  }, [page]);

  return (
    <Image
      src={heroImage?.image || backupImg}
      alt={heroImage?.alt || "Hero image"}
      fill
      priority
      className="object-cover"
    />
  );
}
