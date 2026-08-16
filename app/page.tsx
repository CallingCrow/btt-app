"use client";

import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import { Button } from "@/components/ui/button";
import backupImg from "@/public/Backup.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "./supabase-client";
import Link from "next/link";
import { heroImage } from "@/types/images";
import HeroImage from "@/components/HeroImage";

interface infoSection {
  id: number;
  title: string;
  description: string;
  image: string | null;
  onHome: boolean;
}

export default function Home() {
  const [infoSections, setNewInfoSections] = useState<infoSection[]>([]);
  const [heroImage, setHeroImage] = useState<heroImage | null>(null);

  const fetchInfoSections = async () => {
    const { data, error } = await supabase
      .from("info")
      .select("*")
      .eq("onHome", true);

    if (error) {
      console.error("Error fetching info section on home page", error.message);
      return;
    }

    setNewInfoSections(data);
  };

  useEffect(() => {
    fetchInfoSections();
  }, []);

  const fetchHeroImage = async () => {
    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .eq("page", "home")
      .maybeSingle();

    if (error) {
      console.error("Error fetching hero image on home page", error.message);
      return;
    }

    setHeroImage(data);
  };

  useEffect(() => {
    fetchHeroImage();
  }, []);

  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        <section className="relative z-10 w-full h-[35vh] lg:h-[50vh] flex items-center py-2 sm:py-12 flex justify-center">
          <HeroImage page="home"></HeroImage>
          <div className="absolute inset-0 bg-black/60 lg:bg-black/50" />
          <div className="relative z-10 mx-[6rem] w-full py-[1rem] sm:py-0">
            <div className="items-center">
              <div className="text-center flex-col justify-center md:justify-start md:text-left space-y-3">
                <h1 className="text-white font-bold leading-tight">
                  Best quality ingredients, <br></br> made fresh
                </h1>
                <div className="max=w">
                  <p className="text-white text-[1.25rem] text-wrap">
                    Bubble Tea Time is committed to providing{" "}
                    <br className="hidden md:block"></br> its customers the
                    freshest tasting drinks
                  </p>
                </div>
                <div className="flex justify-center md:justify-start gap-4">
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="cursor-pointer"
                  >
                    <Link href="/menu">Order Pickup</Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="cursor-pointer"
                  >
                    <a
                      href="https://www.ubereats.com/ca/store/bubble-tea-time-w-10th-ave/IeY35VC-TOy8DG6Y0wTZQg?utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas&rwg_token=AE37R_jksu7s0PgIpZuxVQEsPgfa3xWj7XwJDmAjJHwgK2LPbGaPNvZVjtLmpS7KJ0pW_OIlO6ckMJWKiVI1KzhJpZlmVZWAgw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Order Delivery
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div>
          <div className="items-center flex justify-center mt-[1.25rem] md:mt-[2.5rem] md:mb-[1rem]">
            <h3>Menu</h3>
          </div>
          <Menu showAll={false} />
        </div>
        <section className="space-y-[2.5rem]">
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
        </section>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}
