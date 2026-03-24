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
      .from("contact-info")
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
        <section className="space-y-[40px] bg-secondary">
          <div className='px-[20px] md:px-[40px] lg:px-[96px] grid grid-rows-2 md:grid-cols-2 gap-x-[40px]'>
            <div>
              <h4 className='pt-[60px] pb-[20px]'>Get in Touch</h4>
              {contactInfoList.map((contactInfo, key) => (
                <div key={key} className='py-[10px] max-w-[300px]'>
                  <h6 className=''>{contactInfo.name}:</h6>
                  <h6 className='text-wrap pt-[6px]'>{contactInfo.info}</h6>
                </div>
              ))}
            </div>
            <div className='flex justify-center'>
              {/* map here */}
              Test2
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