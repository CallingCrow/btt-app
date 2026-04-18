"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import InstagramIcon from "./icons/InstagramIcon";
import FacebookIcon from "./icons/FacebookIcon";
import { supabase } from "@/app/supabase-client";
import { useEffect, useState } from "react";

interface day {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  isClosed: boolean;
}

interface contactInfo {
  id: number;
  name: string;
  info: string;
}

const Footer = () => {
  const [hours, setHours] = useState<day[]>([]);
  const [contactInfoList, setContactInfoList] = useState<contactInfo[]>([]);

  const fetchHours = async () => {
    const { data, error } = await supabase
      .from("hours")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching hours", error.message);
      return;
    }

    setHours(data);
  };

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchcontactInfoList = async () => {
    const { data, error } = await supabase.from("contact_info").select("*");

    if (error) {
      console.error("Error fetching contact info:", error.message);
      return;
    }

    setContactInfoList(data);
  };

  useEffect(() => {
    fetchcontactInfoList();
  }, []);

  return (
    <div className="bg-accent-foreground text-accent mt-[2.5rem]">
      {/* Mobile View */}
      <div className="md:hidden pt-[3.75rem] grid grid-rows-3 gap-[3.75rem] mb-[1.25rem] items-center">
        <div className="text-center">
          <h4>Contact</h4>
          <div className="text-[1rem] mt-[1.875rem] space-y-[1.25rem] flex flex-col">
            {contactInfoList.map((contactInfo, key) => (
              <p key={key}>{contactInfo.info}</p>
            ))}
            <div className="flex justify-center space-x-[1rem] items-center">
              <div className="flex justify-start space-x-[1rem]">
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
          <div className="text-center text-[1rem] mt-[1.875rem] space-y-[1.25rem] flex flex-col mx-[6.25rem] sm:mx-[11.25rem]">
            {hours.map((day, key) => (
              <div key={key} className="flex justify-between">
                <p>{day.day}:</p>
                {day.isClosed ? (
                  <p>Closed</p>
                ) : (
                  <p>
                    {day.start_time}-{day.end_time}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="items-center text-center space-y-[2.5rem]">
          <div>
            <h4>Bubble Tea Time</h4>
            <p className="!text-[0.875rem]">
              Best quality ingredients, made fresh
            </p>
          </div>
          {/* Find some way to prevent bot spam? */}
          {/* TO DO Make this do something!! */}
          <form className="space-y-[1.875rem] flex flex-col mx-[6.25rem] sm:mx-[11.25rem]">
            <label className="text-[1.25rem]">Join the mailing list!</label>
            <input
              type="email"
              placeholder="Your email"
              className="mt-[0.625rem] border-b-2 border-b-accent focus:outline-none"
            ></input>
            <Button type="submit" size="lg" className="text-[1rem] mx-[5rem]">
              Subscribe
            </Button>
          </form>
        </div>
        <div className="block border-t-2 border-solid border-accent">
          <div className="flex justify-between mx-[1.25rem] py-[0.625rem]">
            <p>© 2026 BubbleTeaTime</p>
            {/* <Link href="/admin">Admin Login</Link> */}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:pt-[5rem] md:block">
        <div className="md:grid md:grid-cols-3 space-x-[6rem] md:mx-[6rem] mb-[5rem]">
          <div className="space-y-[2.5rem]">
            <div>
              <h4>Bubble Tea Time</h4>
              <p className="!text-[0.875rem]">
                Best quality ingredients, made fresh
              </p>
            </div>
            {/* Find some way to prevent bot spam? */}
            {/* TO DO Make this do something!! */}
            <form className="space-y-[1.875rem] max-w-[18.75rem]">
              <label className="text-[1.25rem]">Join the mailing list!</label>
              <input
                type="email"
                placeholder="Your email"
                className="mt-[0.625rem] border-b-2 border-b-accent focus:outline-none"
              ></input>
              <Button type="submit" size="lg" className="text-[1rem]">
                Subscribe
              </Button>
            </form>
          </div>
          <div className="text-center">
            <h4>Contact</h4>
            <div className="text-[1rem] mt-[1.875rem] space-y-[1.25rem] flex flex-col items-center">
              {contactInfoList.map((contactInfo, key) => (
                <p key={key} className="w-[15.625rem]">
                  {contactInfo.info}
                </p>
              ))}
              <div className="flex justify-center space-x-[1rem] items-center">
                <div className="flex justify-start space-x-[1rem]">
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
          <div className="text-center flex-col justify-center">
            <h4>Hours</h4>
            <div className="text-center text-[1rem] mt-[1.875rem] space-y-[1.25rem] flex flex-col mx-[0.625rem] lg:mx-[1.25rem] xl:mx-[3.125rem]">
              {hours.map((day, key) => (
                <div key={key} className="flex justify-between">
                  <p className="">{day.day}</p>
                  {day.isClosed ? (
                    <p>Closed</p>
                  ) : (
                    <p>
                      {day.start_time}-{day.end_time}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="block border-t-2 border-solid border-accent">
          <div className="flex justify-between mx-[1.25rem] md:mx-[6rem] py-[0.625rem]">
            <p>© 2026 BubbleTeaTime</p>
            {/* <Link href="/admin">Admin Login</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
