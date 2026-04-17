"use client";

import React from "react";
import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import HeroImage from "@/components/HeroImage";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";

interface infoSection {
  id: number;
  title: string;
  description: string;
  image: string;
  onHome: boolean;
}

const AboutPage = () => {
  const [infoSections, setNewInfoSections] = useState<infoSection[]>([]);

  const fetchInfoSections = async () => {
    const { data, error } = await supabase
      .from("info")
      .select("*")
      .eq("onHome", false);

    if (error) {
      console.error(
        "Error fetching info section on about page:",
        error.message,
      );
      return;
    }

    setNewInfoSections(data);
  };

  useEffect(() => {
    fetchInfoSections();
  }, []);

  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        <section className="relative z-10 w-full h-[10vh] sm:h-[40vh] flex items-center py-2 sm:py-12 ">
          <HeroImage page="about"></HeroImage>
        </section>
        <div className="space-y-[2.5rem]">
          {infoSections.map((infoSection, index) => (
            <InfoSection
              key={index}
              header={infoSection.title}
              text={infoSection.description}
              image={infoSection.image}
              bgPrimary={index % 2 === 0}
              layoutPrimary={index % 2 === 0}
            />
          ))}
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutPage;
