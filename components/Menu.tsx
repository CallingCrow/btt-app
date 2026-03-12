'use client'

import React from "react";
import { useState } from "react";
import MenuSection from "./MenuSection";
import { useMenu } from "@/context/MenuContext";

const Menu = ({ showAll }: any) => {
  const { groupedItems, refetch, loading } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState('Milk Tea');

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <div>
        {showAll ? (
          <div className="flex flex-col min-h-screen">
            <div className="sticky z-50 top-[64px] bg-white flex justify-between border-b-2 border-solid mb-[40px] py-[10px] px-[20px] md:px-[40px] lg:px-[96px]">
              <div className="text-[20px] flex gap-x-[40px]">
                <button onClick={() => scrollTo('Milk Tea')}>Milk Tea</button>
                <button onClick={() => scrollTo('Fruit Tea')}>Fruit Tea</button>
                <button onClick={() => scrollTo('Chiller')}>Chiller</button>
                <button onClick={() => scrollTo('Smoothie')}>Smoothie</button>
                <button onClick={() => scrollTo('Frappuccino')}>Frappuccino</button>
              </div>
              <div>Search</div>
            </div>
            <div>
              {[...groupedItems.entries()].map(([type, items]) => (
                <div id={type}>
                  <MenuSection key={type} type={type} items={items} showHeader={true} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between border-b-2 border-solid mb-[40px] py-[10px] px-[20px] md:px-[40px] lg:px-[96px]">
              <div className="text-[20px] flex gap-x-[40px]">
                <button onClick={() => setSelectedCategory('Milk Tea')} className={`${selectedCategory == 'Milk Tea' && "font-semibold"}`}>Milk Tea</button>
                <button onClick={() => setSelectedCategory('Fruit Tea')} className={`${selectedCategory == 'Fruit Tea' && "font-semibold"}`}>Fruit Tea</button>
                <button onClick={() => setSelectedCategory('Chiller')} className={`${selectedCategory == 'Chiller' && "font-semibold"}`}>Chiller</button>
                <button onClick={() => setSelectedCategory('Smoothie')} className={`${selectedCategory == 'Smoothie' && "font-semibold"}`}>Smoothie</button>
                <button onClick={() => setSelectedCategory('Frappuccino')} className={`${selectedCategory == 'Frappuccino' && "font-semibold"}`}>Frappuccino</button>
              </div>
              <div>Search</div>
            </div>
            <MenuSection
              type={selectedCategory}
              items={groupedItems.get(selectedCategory) || []}
              showHeader={false}
            />
          </div>

        )}
      </div>
    </div>
  );
};

export default Menu;
