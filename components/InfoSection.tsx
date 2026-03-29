import React from "react";
import Image, { StaticImageData } from "next/image";

interface InfoSectionProps {
  header: string;
  text: string;
  image: string | StaticImageData;
  bgPrimary?: boolean;
  layoutPrimary: boolean;
}

export const InfoSection = ({
  header,
  text,
  image,
  bgPrimary,
  layoutPrimary,
}: InfoSectionProps) => {
  if (layoutPrimary) {
    return (
      <div
        className={`sm:grid sm:grid-cols-2 gap-x-[40px] md:gap-x-[80px] px-[20px] md:px-[40px] lg:px-[96px] py-[20px] md:py-[60px] ${bgPrimary ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
      >
        <div className="md:mt-[40px] space-y-[16px] lg:max-w-[35vw]">
          <h2>{header}</h2>
          <p className="leading-8">{text}</p>
        </div>
        <div>
          <div className="rounded-lg bg-background flex items-center justify-center overflow-hidden mt-[20px] sm:mt-0">
            {image===null || image==="" ? (
              <div></div>
            ) : (
              <Image src={image} width={640} height={400} alt="TO DO" className="2xl:scale-120"/>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`sm:grid sm:grid-cols-2 sm:gap-x-[40px] md:gap-x-[80px] px-[20px] md:px-[40px] lg:px-[96px] py-[20px] md:py-[60px] ${bgPrimary ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
      >
        <div>
          <div className="rounded-lg bg-background flex items-center justify-center overflow-hidden mt-[20px] sm:mt-0">
            {image===null || image==="" ? (
              <div></div>
            ) : (
              <Image src={image} width={640} height={400} alt="TO DO" className="2xl:scale-120"/>
            )}
          </div>
        </div>
        <div className="mt-[20px] md:mt-[40px] space-y-[16px] lg:max-w-[40vw]">
          <h2>{header}</h2>
          <p className="leading-8">{text}</p>
        </div>
      </div>
    );
  }
};