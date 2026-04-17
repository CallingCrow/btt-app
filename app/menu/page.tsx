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
          <section className="relative z-10 w-full h-[10vh] sm:h-[40vh] flex items-center py-2 sm:py-12 ">
            <HeroImage page="menu"></HeroImage>
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
