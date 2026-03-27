'use client'

import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import { Button } from "@/components/ui/button";
import heroImg from "@/public/Hero.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "./supabase-client";

interface infoSection {
  id: number;
  title: string;
  description: string;
  image: string;
  onHome: boolean;
}

export default function Home() {
    const [infoSections, setNewInfoSections] = useState<infoSection[]>([]);
  
    const fetchInfoSections = async () => {
        const { data, error } = await supabase
        .from("info")
        .select("*")
        .eq('onHome', true)
  
        if (error) {
        console.error("Error fetching info section on home page", error.message);
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
        <section className="relative z-10 w-full min-h-[10vh] sm:min-h-[50vh] flex items-center py-2 sm:py-12 ">
          {/* <div className="absolute inset-0 max-md:bg-black/50 lg:bg-linear-to-r lg:from-black/0 lg:to-black/60" /> */}

          <Image
            src={heroImg}
            alt="ALT TO DO"
            fill
            priority
            className="object-cover"
          />

          <div className="relative z-10 mx-[6rem] w-full">
            <div className="items-center">
              <div className="text-center flex-col justify-center lg:justify-start lg:text-left space-y-3">
                <h1 className="text-foreground font-bold leading-tight">
                  Best quality ingredients, <br></br> made fresh
                </h1>
                <p className="text-foreground text-[1.25rem] text-wrap">
                  Bubble Tea Time is committed to providing its customers the
                  freshest tasting drinks
                </p>
                <div className="flex justify-center lg:justify-start gap-4">
                  <Button variant="default" size="lg">
                    Order Pickup
                  </Button>
                  <Button variant="secondary" size="lg">
                    Order Delivery
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
