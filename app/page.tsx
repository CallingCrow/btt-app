import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";

export default function Home() {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        Home
        <div>Hero Section</div>
        <div>
          <Menu showAll={false} />
        </div>
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
        <Footer></Footer>
      </footer>
    </div>
  );
}
