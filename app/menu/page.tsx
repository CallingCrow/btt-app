import { NavBar } from "@/components/NavBar";
import Menu from "@/components/Menu";
import React from "react";
import Footer from "@/components/Footer";
import { supabase } from "../supabase-client";
import Image from "next/image";

const MenuPage = () => {
  const { data } = supabase
    .storage
    .from('hero-images')
    .getPublicUrl('menu.png');
  const heroUrl = data.publicUrl;

  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        <div>
          <section className="relative z-10 w-full max-h-[10vh] sm:max-h-[50vh] flex items-center py-2 sm:py-12 ">
            {/* <div className="absolute inset-0 max-md:bg-black/50 lg:bg-linear-to-r lg:from-black/0 lg:to-black/60" /> */}
            {/* <img
              src={heroUrl}
              alt="TO DO"
              className="object-cover object-fill"
            >
            </img> */}
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
                </div>
              </div>
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
