'use client'

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
      .order("id")

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
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")

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
    <div className="bg-accent-foreground text-accent mt-[40px]">
      {/* Mobile View */}
      <div className="md:hidden pt-[60px] grid grid-rows-3 gap-[60px] mb-[20px] items-center">
        <div className="text-center">
          <h4>Contact</h4>
          <div className="text-[16px] mt-[30px] space-y-[20px] flex flex-col">
            {contactInfoList.map((contactInfo, key) => (
              <p key={key}>{contactInfo.info}</p>
            ))}
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
          <div className="text-center text-[16px] mt-[30px] space-y-[20px] flex flex-col mx-[100px] sm:mx-[180px]">
            {hours.map((day, key) => (
              <div key={key} className='flex justify-between'>
                <p>{day.day}:</p>
                {day.isClosed ? <p>Closed</p> : <p>{day.start_time}-{day.end_time}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="items-center text-center space-y-[40px]">
          <div>
            <h4>Bubble Tea Time</h4>
            <p className="!text-[14px]">Best quality ingredients, made fresh</p>
          </div>
          {/* Find some way to prevent bot spam? */}
          {/* TO DO Make this do something!! */}
          <form className="space-y-[30px] flex flex-col mx-[100px] sm:mx-[180px]">
            <label className="text-[20px]">Join the mailing list!</label>
            <input
              type="email"
              placeholder="Your email"
              className="mt-[10px] border-b-2 border-b-accent focus:outline-none"
            ></input>
            <Button type="submit" size="lg" className="text-[16px] mx-[80px]">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:pt-[80px] md:block">
        <div className="md:grid md:grid-cols-3 space-x-[96px] md:mx-[96px] mb-[80px]">
          <div className="space-y-[40px]">
            <div>
              <h4>Bubble Tea Time</h4>
              <p className="!text-[14px]">
                Best quality ingredients, made fresh
              </p>
            </div>
            {/* Find some way to prevent bot spam? */}
            {/* TO DO Make this do something!! */}
            <form className="space-y-[30px] max-w-[300px]">
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
            <div className="text-[16px] mt-[30px] space-y-[20px] flex flex-col items-center">
            {contactInfoList.map((contactInfo, key) => (
              <p key={key} className="w-[250px]">{contactInfo.info}</p>
            ))}
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
          <div className="text-center flex-col justify-center">
            <h4>Hours</h4>
            <div className="text-center text-[16px] mt-[30px] space-y-[20px] flex flex-col mx-[10px] lg:mx-[20px] xl:mx-[50px]">
            {hours.map((day, key) => (
              <div key={key} className='flex justify-between'>
                <p className=''>{day.day}</p>
                {day.isClosed ? <p>Closed</p> : <p>{day.start_time}-{day.end_time}</p>}
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:border-t-2 lg:border-solid lg:border-accent">
          <div className="flex justify-between mx-[20px] md:mx-[96px] py-[10px]">
            <p>@copyright</p>
            <Link href="/admin">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
