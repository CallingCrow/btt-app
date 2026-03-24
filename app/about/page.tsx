'use client'

import React from "react";
import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import heroImg from "@/public/Hero.jpg";
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
      .eq('onHome', false)

      if (error) {
      console.error("Error fetching info section on about page:", error.message);
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
        <div>Top image</div>
        <div className="space-y-[40px]">
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
