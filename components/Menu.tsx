'use client'

import React from "react";
import { useState } from "react";
import MenuSection from "./MenuSection";
import { useRef } from 'react';

const Menu = ({ showAll }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('Milk Tea');
  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <div>
      <div>
        {showAll ? (
          <div className="flex flex-col min-h-screen">
            <div className="sticky z-50 top-[64px] bg-white flex justify-between border-b-2 border-solid mb-[40px] py-[10px] px-[20px] md:px-[40px] lg:px-[96px]">
              <div className="text-[20px] flex gap-x-[40px]">
                <button onClick={() => scrollTo('milkTea')}>Milk Tea</button>
                <button onClick={() => scrollTo('fruitTea')}>Fruit Tea</button>
                <button onClick={() => scrollTo('chiller')}>Chiller</button>
                <button onClick={() => scrollTo('smoothie')}>Smoothie</button>
                <button onClick={() => scrollTo('frappuccino')}>Frappuccino</button>
              </div>
              <div>Search</div>
            </div>
            <div>
              <div id="milkTea"><MenuSection category="Milk Tea" showHeader={true}></MenuSection></div>
              <div id="fruitTea"><MenuSection category="Fruit Tea" showHeader={true}></MenuSection></div>
              <div id="chiller"><MenuSection category="Chiller" showHeader={true}></MenuSection></div>
              <div id="smoothie"><MenuSection category="Smoothie" showHeader={true}></MenuSection></div>
              <div id="frappuccino"><MenuSection category="Frappuccino" showHeader={true}></MenuSection></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between border-b-2 border-solid mb-[40px] py-[10px] px-[20px] md:px-[40px] lg:px-[96px]">
              <div className="text-[20px] flex gap-x-[40px]">
                <button onClick={()=>setSelectedCategory('Milk Tea')} className={`${selectedCategory=='Milk Tea' && "font-semibold"}`}>Milk Tea</button>
                <button onClick={()=>setSelectedCategory('Fruit Tea')} className={`${selectedCategory=='Fruit Tea' && "font-semibold"}`}>Fruit Tea</button>
                <button onClick={()=>setSelectedCategory('Chiller')} className={`${selectedCategory=='Chiller' && "font-semibold"}`}>Chiller</button>
                <button onClick={()=>setSelectedCategory('Smoothie')} className={`${selectedCategory=='Smoothie' && "font-semibold"}`}>Smoothie</button>
                <button onClick={()=>setSelectedCategory('Frappuccino')} className={`${selectedCategory=='Frappuccino' && "font-semibold"}`}>Frappuccino</button>
              </div>
              <div>Search</div>
            </div>
            <MenuSection category={selectedCategory} showHeader={false}></MenuSection>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default Menu;
