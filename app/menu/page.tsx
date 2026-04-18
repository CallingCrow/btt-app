import { NavBar } from "@/components/NavBar";
import Menu from "@/components/Menu";
import React from "react";
import Footer from "@/components/Footer";
import { supabase } from "../supabase-client";
import HeroImage from "@/components/HeroImage";

const MenuPage = () => {
  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        <div>
          <section className="relative z-10 w-full h-[30vh] lg:h-[40vh] flex items-center py-2 sm:py-12 ">
            <HeroImage page="menu"></HeroImage>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-full text-white">
              <h1 className="text-white font-bold text-center">Menu</h1>
            </div>
          </section>
          <section className="">
            <Menu showAll={true} />
          </section>
        </div>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default MenuPage;
