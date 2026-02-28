import React from "react";
import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import heroImg from "@/public/Hero.jpg";

const AboutPage = () => {
  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        <div>Top image</div>
        <div className="space-y-[40px]">
          <InfoSection
            header="Limitless Customization"
            text="Paragraph text"
            image={heroImg}
            bgPrimary={true}
            layoutPrimary={true}
          />
          <InfoSection
            header="Limitless Customization"
            text="Paragraph text"
            image={heroImg}
            bgPrimary={false}
            layoutPrimary={false}
          />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutPage;
