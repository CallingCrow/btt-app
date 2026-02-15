import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <div className="mt-[40px] pt-[80px] space-y-[10px] bg-accent-foreground text-accent">
      <div className="md:grid md:grid-cols-4 space-x-[96px] md:mt-[80px] md:mx-[96px]">
        <div>
          <h4>Brand</h4>
        </div>
        <div>
          <h4>Contact</h4>
          <div className="text-[16px] mt-[30px] space-y-[20px] flex flex-col">
            {/* TO DO!! */}
            <p>425-425-425</p>
            <p>epicemail@gmail.com</p>
            <p>
              2545 Blanca St, Vancouver, <br></br>BC V6T 1C8, Canada
            </p>
            <div className="flex justify-start space-x-[16px] text-center">
              <div className="flex justify-start space-x-[16px]">
                {/* TO DO!! */}
                <Button variant="default" size="icon">
                  F
                </Button>
                <Button variant="default" size="icon">
                  I
                </Button>
              </div>
              <p>@bubble.tea.time</p>
            </div>
          </div>
        </div>
        <div>
          <h4>Browse</h4>
          <div className="text-[16px] mt-[30px] space-y-[20px] flex flex-col">
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            {/* TO DO!! */}
            <Link href="/">My Cart</Link>
          </div>
        </div>
        <div>
          <h4>Hours</h4>
        </div>
      </div>
      <div className="hidden lg:block lg:border-t-2 lg:border-solid lg:border-accent">
        <div className="flex justify-between mx-[20px] md:mx-[96px] my-[10px]">
          <p>@copyright</p>
          <p>Admin Login</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
