import React from "react";
import Image, { StaticImageData } from "next/image";

interface InfoSectionProps {
  header: string;
  text: string;
  image: string | StaticImageData;
  bgprimary?: boolean;
}

export const InfoSection = ({
  header,
  text,
  image,
  bgprimary,
}: InfoSectionProps) => {
  return (
    <div
      className={`sm:grid sm:grid-cols-2 space-x-[40px] md:space-x-[80px] px-[20px] md:px-[96px] py-[20px] md:py-[60px] ${bgprimary ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
    >
      <div className="md:mt-[40px] space-y-[16px]">
        <h2>{header}</h2>
        <p>{text}</p>
      </div>
      <div>
        <div className="rounded-lg bg-background flex items-center justify-center overflow-hidden mt-[20px] sm:mt-0">
          <Image
            src={image}
            width={640}
            height={400}
            alt="Students scouting using green scouting tablets."
          />
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className="relative"></div>
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Match Scouting</h2>
      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
        Real-time match data collection during competitions. Capture live
        performance metrics, game events, and team actions with our fast and
        intuitive scouting interface designed for the heat of competition.
      </p>
      <Link href="/login">
        <Button variant="outline" size="lg" className="gap-2">
          GET STARTED <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  </div>
</div>; */
}
