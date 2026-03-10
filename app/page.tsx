import { NavBar } from "@/components/NavBar";
import { InfoSection } from "@/components/InfoSection";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import { Button } from "@/components/ui/button";
import heroImg from "@/public/Hero.jpg";
import Image from "next/image";

export default function Home() {
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

          <div className="relative z-10 mx-[96px] w-full">
            <div className="items-center">
              <div className="text-center flex-col justify-center lg:justify-start lg:text-left space-y-3">
                <h1 className="text-foreground font-bold leading-tight">
                  Best quality ingredients, <br></br> made fresh
                </h1>
                <p className="text-foreground text-[20px] text-wrap">
                  Bubble Tea Time is committed to providing its customers the
                  freshest tasting drinks
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Button variant="default" size="lg">
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div>
          <div className="items-center flex justify-center mt-[40px] mb-[16px]">
            <h3>Menu</h3>
          </div>
          <Menu showAll={false} />
        </div>
        <section className="space-y-[40px]">
          <InfoSection
            header="Limitless Customization"
            text="At Bubble Tea Time, every drink is made just the way you like it. Choose your favorite flavor, milk option, sweetness level, ice level, and toppings. From classic tapioca pearls to fun popping boba flavors, the possibilities are almost limitless. Whether you prefer something creamy, fruity, or refreshing, you can create the perfect drink that matches your taste every time you visit."
            image={heroImg}
            bgPrimary={true}
            layoutPrimary={true}
          />
          <InfoSection
            header="Limitless Customization"
            text="We insist on making the Deerioca from  scratch: making the dough, kneading and rolling the dough into small  balls, this procedure creates better texture and aroma for the tapioca. "
            image={heroImg}
            bgPrimary={false}
            layoutPrimary={false}
          />
        </section>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}
