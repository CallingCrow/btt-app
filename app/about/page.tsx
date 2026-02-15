import React from "react";
import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <div>Top image</div>
        <div className="space-y-[40px]">
          <InfoSection
            header="Limitless Customization"
            text="Paragraph text"
            image="image here"
            bgprimary={true}
          />
          <InfoSection
            header="Limitless Customization"
            text="Paragraph text"
            image="image here"
            bgprimary={false}
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
