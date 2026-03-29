'use client'

import React from 'react';
import { NavBar } from '@/components/NavBar';
import { supabase } from '../supabase-client';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';

interface contactInfo {
  id: number;
  name: string;
  info: string;
}

const ContactPage = () => {
  const [contactInfoList, setContactInfoList] = useState<contactInfo[]>([]);

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

  const { data } = supabase
    .storage
    .from('misc-images')
    .getPublicUrl('map.png');
  const mapUrl = data.publicUrl;

  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        ContactPage
        <section className="relative z-10 w-full min-h-[10vh] sm:min-h-[50vh] flex items-center py-2 sm:py-12 ">
          {/* <div className="absolute inset-0 max-md:bg-black/50 lg:bg-linear-to-r lg:from-black/0 lg:to-black/60" /> */}

          {/* <Image
            src={heroImg}
            alt="ALT TO DO"
            fill
            priority
            className="object-cover"
          /> */}
        </section>
        <section className="space-y-[2.5rem] bg-secondary h-[56rem] sm:h-[28rem] md:h-[32rem]">
          <div className='pt-[3.75rem] px-[1.25rem] md:px-[2.5rem] lg:px-[6rem] grid grid-rows-2 sm:grid-cols-2 gap-x-[2.5rem] sm:gap-y-[3rem]'>
            <div>
              <h4 className='pb-[1.25rem]'>Get in Touch</h4>
              {contactInfoList.map((contactInfo, key) => (
                <div key={key} className='py-[0.625rem] max-w-[18.75rem]'>
                  <h6 className=''>{contactInfo.name}:</h6>
                  <h6 className='text-wrap pt-[0.375rem]'>{contactInfo.info}</h6>
                </div>
              ))}
            </div>
            <div className='flex justify-center'>
              {/* map here */}
              <img
                src={mapUrl}
                alt="Map"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  )
}

export default ContactPage;


// {infoSections.map((infoSection, index) => (
//   <InfoSection
//     key={index}
//     header={infoSection.title}
//     text={infoSection.description}
//     image={infoSection.image}
//     bgPrimary={index % 2 === 0}
//     layoutPrimary={index % 2 === 0}
//   />
// ))}