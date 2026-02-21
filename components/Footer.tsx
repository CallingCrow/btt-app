import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import InstagramIcon from "./icons/InstagramIcon";
import FacebookIcon from "./icons/FacebookIcon";

const Footer = () => {
  return (
    <div className="mt-[40px] pt-[80px] bg-accent-foreground text-accent">
      <div className="md:grid md:grid-cols-3 space-x-[96px] md:mx-[96px] mb-[80px]">
        <div className="space-y-[40px]">
          <div>
            <h4>Brand TO DO</h4>
            <p className="!text-[14px]">Best quality ingredients, made fresh</p>
          </div>
          {/* Find some way to prevent bot spam? */}
          {/* TO DO Make this do something!! */}
          <form className="space-y-[30px]">
            <label className="text-[20px]">Join the mailing list!</label>
            <input
              type="email"
              placeholder="Your email"
              className="mt-[10px] border-b-2 border-b-accent focus:outline-none"
            ></input>
            <Button type="submit" size="lg" className="text-[16px]">
              Subscribe
            </Button>
          </form>
        </div>
        <div className="text-center">
          <h4>Contact</h4>
          <div className="text-[16px] mt-[30px] space-y-[20px] flex flex-col">
            {/* TO DO!! */}
            <p>425-425-425</p>
            <p>epicemail@gmail.com</p>
            <p>
              2545 Blanca St, Vancouver, <br></br>BC V6T 1C8, Canada
            </p>
            <div className="flex justify-center space-x-[16px] items-center">
              <div className="flex justify-start space-x-[16px]">
                <Button variant="default" size="icon">
                  <InstagramIcon />
                </Button>
                <Button variant="default" size="icon">
                  <FacebookIcon />
                </Button>
              </div>
              {/* TO DO!! */}
              <p>@bubble.tea.time</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h4>Hours</h4>
          <div className="text-center text-[16px] mt-[30px] space-y-[20px] flex justify-center flex-col mx-[120px]">
            <div className="flex justify-between">
              <p>Monday</p>
              <p>2:00pm-8:00pm</p>
            </div>
            <div className="flex justify-between">
              <p>Tuesday</p>
              <p>2:00pm-8:00pm</p>
            </div>
            <div className="flex justify-between">
              <p>Wednesday</p>
              <p>2:00pm-8:00pm</p>
            </div>
            <div className="flex justify-between">
              <p>Thursday</p>
              <p>2:00pm-8:00pm</p>
            </div>
            <div className="flex justify-between">
              <p>Friday</p>
              <p>2:00pm-8:00pm</p>
            </div>
            <div className="flex justify-between">
              <p>Saturday</p>
              <p>2:00pm-8:00pm</p>
            </div>
            <div className="flex justify-between">
              <p>Sunday</p>
              <p>2:00pm-8:00pm</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:border-t-2 lg:border-solid lg:border-accent">
        <div className="flex justify-between mx-[20px] md:mx-[96px] py-[10px]">
          <p>@copyright</p>
          <p>Admin Login</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
